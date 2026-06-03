import { roomsAPI, bookingsAPI, complaintsAPI, emergenciesAPI } from '@/lib/api';

// Define the database schemas/tools in OpenAI format
const openAITools = [
    {
        type: 'function',
        function: {
            name: 'listAvailableRooms',
            description: 'Retrieve all hotel rooms. Useful to find available rooms, prices, capacities, and amenities.',
            parameters: {
                type: 'object',
                properties: {
                    roomType: {
                        type: 'string',
                        description: 'Optional filter for room type (e.g. Single, Double, Suite, Deluxe, Presidential).'
                    },
                    maxPrice: {
                        type: 'number',
                        description: 'Optional filter for maximum room price.'
                    }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'createRoomBooking',
            description: 'Create a new room booking reservation for a guest. Calculate and provide the total price based on checking dates and room rate.',
            parameters: {
                type: 'object',
                properties: {
                    guestName: { type: 'string', description: 'Full name of the guest.' },
                    guestEmail: { type: 'string', description: 'Email address of the guest.' },
                    guestPhone: { type: 'string', description: 'Phone number of the guest.' },
                    roomId: { type: 'string', description: 'The ID of the room (e.g. room-1, room-2).' },
                    roomNumber: { type: 'string', description: 'The room number (e.g. 101, 102).' },
                    roomType: { type: 'string', description: 'The type of the room.' },
                    checkIn: { type: 'string', description: 'Check-in date in YYYY-MM-DD format.' },
                    checkOut: { type: 'string', description: 'Check-out date in YYYY-MM-DD format.' },
                    guests: { type: 'number', description: 'Number of guests.' },
                    totalPrice: { type: 'number', description: 'Total price of the booking.' }
                },
                required: ['guestName', 'guestEmail', 'guestPhone', 'roomId', 'roomNumber', 'roomType', 'checkIn', 'checkOut', 'guests', 'totalPrice']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'submitComplaint',
            description: 'Submit a new complaint, maintenance request, or service issue for a guest.',
            parameters: {
                type: 'object',
                properties: {
                    guestName: { type: 'string', description: 'Name of the guest.' },
                    guestEmail: { type: 'string', description: 'Email of the guest.' },
                    category: { type: 'string', description: 'Category of complaint (e.g., Room, Service, Staff, Food, General).' },
                    description: { type: 'string', description: 'Detailed description of the issue.' }
                },
                required: ['guestName', 'guestEmail', 'category', 'description']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'fileEmergencyAlert',
            description: 'Report a critical medical, fire, or security emergency alert for immediate assistance from staff.',
            parameters: {
                type: 'object',
                properties: {
                    type: { type: 'string', description: 'Emergency category (Medical, Fire, Security, Other).' },
                    description: { type: 'string', description: 'What is happening.' },
                    contactNumber: { type: 'string', description: 'Immediate contact callback number.' },
                    location: { type: 'string', description: 'Location of the emergency (e.g. Room 102, Lobby).' }
                },
                required: ['type', 'description', 'contactNumber', 'location']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'getGuestBookings',
            description: 'Retrieve all existing bookings for a guest by their email address or a specific booking ID to check status or details.',
            parameters: {
                type: 'object',
                properties: {
                    guestEmail: { type: 'string', description: 'Email address of the guest to search for bookings.' },
                    bookingId: { type: 'string', description: 'Optional booking ID (e.g. BK-123) to look up a specific reservation.' }
                }
            }
        }
    }
];

// Tool execution mapping
async function executeTool(name: string, args: any) {
    console.log(`Executing tool: ${name} with args:`, args);
    try {
        if (name === 'listAvailableRooms') {
            const rooms = await roomsAPI.getAll();
            return rooms.filter((r: any) => {
                if (args.roomType && r.type.toLowerCase() !== args.roomType.toLowerCase()) return false;
                if (args.maxPrice && r.price > args.maxPrice) return false;
                return true;
            });
        }
        
        if (name === 'createRoomBooking') {
            const newBooking = await bookingsAPI.create(args);
            return { success: true, booking: newBooking };
        }
        
        if (name === 'submitComplaint') {
            const newComplaint = await complaintsAPI.create(args);
            return { success: true, complaint: newComplaint };
        }
        
        if (name === 'fileEmergencyAlert') {
            const newEmergency = await emergenciesAPI.create(args);
            return { success: true, emergency: newEmergency };
        }

        if (name === 'getGuestBookings') {
            const bookings = await bookingsAPI.getAll();
            const matched = bookings.filter((b: any) => {
                if (args.bookingId && String(b.id).toLowerCase() === String(args.bookingId).toLowerCase()) return true;
                if (args.guestEmail && String(b.guestEmail).toLowerCase() === String(args.guestEmail).toLowerCase()) return true;
                return false;
            });
            return { success: true, bookings: matched };
        }
    } catch (e: any) {
        console.error(`Tool execution failed for ${name}:`, e);
        return { success: false, error: e.message || 'Operation failed' };
    }
    
    return { error: `Tool ${name} not found` };
}

export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return Response.json({
            message: "Chatbot is offline because the OPENAI_API_KEY environment variable is not configured on the server. Please add it to your .env.local file to activate OpenAI chat features."
        });
    }

    try {
        const { messages, userContext } = await req.json();
        if (!messages || messages.length === 0) {
            return Response.json({ error: 'No messages provided' }, { status: 400 });
        }

        // Define system instructions including active user's details if logged in
        let systemInstruction = 'You are Grand Hotel Assistant, a friendly and professional virtual concierge. ' +
            'CRITICAL GUIDELINE: You must guide the guest by asking exactly ONE question at a time to gather details. ' +
            'Never ask multiple questions or request multiple pieces of information at once. ' +
            'Keep your responses extremely short, concise, and direct (maximum 1 or 2 sentences). Do not add conversational fluff or long introductions. ' +
            'When a guest wants to book a room: ' +
            '1. First ask for their Full Name (skip if user is authenticated). ' +
            '2. Then ask for their Phone Number. ' +
            '3. Then ask for their Email Address (skip if user is authenticated). ' +
            '4. Then ask which Room Type or Room Number they want to book. ' +
            '5. Then ask for the Check-in date naturally (e.g. "What day are you checking in?") and DO NOT specify or mention any date format. ' +
            '6. Then ask for the Check-out date naturally (e.g. "And what day are you checking out?") without specifying any format. ' +
            '7. Then ask for the number of Guests. ' +
            'The guest can say the dates in any natural language format (e.g., "next Friday", "Nov 12", "December 10th"). You must internally interpret their response and convert it to YYYY-MM-DD format when calling the createRoomBooking tool. ' +
            'Collect all of these 7 items one by one sequentially before executing the createRoomBooking tool. ' +
            'Once you have collected all info, call createRoomBooking immediately and state the confirmation. ' +
            'Follow a similar one-question-at-a-time flow for filing complaints or reporting emergencies. ' +
            'Always rely on the tools to query or make changes to the database rather than making up information. ' +
            'Maintain a polite, helpful concierge tone.';
        
        if (userContext && userContext.name) {
            systemInstruction += ` The user you are chatting with is currently authenticated as ${userContext.name} (Email: ${userContext.email || 'N/A'}, Role: ${userContext.role || 'customer'}). Skip asking for their Full Name and Email Address, but collect the other missing details one by one.`;
        }

        // Convert messages array to OpenAI messages format
        // Excluding the last message as we'll send it explicitly
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message
        }));

        const lastMessage = messages[messages.length - 1].message;

        const apiMessages: any[] = [
            { role: 'system', content: systemInstruction },
            ...history,
            { role: 'user', content: lastMessage }
        ];

        let keepLooping = true;
        let responseText = '';
        let iterations = 0;
        const maxIterations = 5; // safety limit

        while (keepLooping && iterations < maxIterations) {
            iterations++;
            console.log(`Calling OpenAI API (iteration ${iterations})...`);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: apiMessages,
                    tools: openAITools,
                    tool_choice: 'auto'
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`OpenAI API error: ${response.statusText} - ${errText}`);
            }

            const data = await response.json();
            const choice = data.choices?.[0];
            if (!choice) {
                throw new Error('No choices returned from OpenAI');
            }

            const assistantMessage = choice.message;
            
            // Push the assistant response to the conversation log for subsequent requests in the loop
            apiMessages.push(assistantMessage);

            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                console.log(`OpenAI requested ${assistantMessage.tool_calls.length} tool call(s)`);
                // Execute tools
                for (const toolCall of assistantMessage.tool_calls) {
                    const { name, arguments: argsString } = toolCall.function;
                    let args = {};
                    try {
                        args = JSON.parse(argsString);
                    } catch (err) {
                        console.error('Failed to parse tool arguments:', argsString);
                    }
                    
                    const toolResult = await executeTool(name, args);
                    
                    apiMessages.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        name: name,
                        content: JSON.stringify(toolResult)
                    });
                }
            } else {
                responseText = assistantMessage.content || '';
                keepLooping = false;
            }
        }

        return Response.json({ message: responseText });
    } catch (e: any) {
        console.error('Chat endpoint error:', e);
        return Response.json({ error: e.message || 'An error occurred during chat processing' }, { status: 500 });
    }
}
