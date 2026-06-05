import { roomsAPI, complaintsAPI, emergenciesAPI } from '@/lib/api';

export const maxDuration = 60; // Set max timeout to 60 seconds for Vercel

// Helper: Normalize a date string (any format) to YYYY-MM-DD
function normalizeToYMD(dateStr: string): string | null {
    if (!dateStr) return null;
    // Already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) return dateStr.trim();
    // Try parsing as a date
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            // Use UTC to avoid timezone shift
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch {}
    return null;
}

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
async function executeTool(name: string, args: any, baseUrl: string, userContext?: any) {
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
            // Auto-fill from userContext if missing
            if (!args.guestName && userContext?.name) args.guestName = userContext.name;
            if (!args.guestEmail && userContext?.email) args.guestEmail = userContext.email;
            if (!args.guestPhone && userContext?.phone) args.guestPhone = userContext.phone;

            // Resolve roomId if only roomNumber is provided
            if (!args.roomId && args.roomNumber) {
                const rooms = await roomsAPI.getAll();
                const room = rooms.find((r: any) => String(r.number) === String(args.roomNumber));
                if (room) args.roomId = room.id;
            }

            // Normalize date fields to YYYY-MM-DD before saving
            if (args.checkIn) {
                const normalized = normalizeToYMD(args.checkIn);
                if (!normalized) {
                    return { success: false, error: `Invalid check-in date: "${args.checkIn}". Please use a clear date like June 10 or 2026-06-10.` };
                }
                args.checkIn = normalized;
            }
            if (args.checkOut) {
                const normalized = normalizeToYMD(args.checkOut);
                if (!normalized) {
                    return { success: false, error: `Invalid check-out date: "${args.checkOut}". Please use a clear date like June 15 or 2026-06-15.` };
                }
                args.checkOut = normalized;
            }
            // Validate check-out is after check-in
            if (args.checkIn && args.checkOut) {
                const inDate = new Date(args.checkIn);
                const outDate = new Date(args.checkOut);
                if (outDate <= inDate) {
                    return { success: false, error: 'Check-out date must be after check-in date. Please ask the guest for a valid check-out date.' };
                }
                // Calculate total price if not provided
                if (!args.totalPrice && args.roomId) {
                    const rooms = await roomsAPI.getAll();
                    const room = rooms.find((r: any) => r.id === args.roomId);
                    if (room) {
                        const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
                        args.totalPrice = room.price * nights;
                        if (!args.roomNumber) args.roomNumber = room.number;
                        if (!args.roomType) args.roomType = room.type;
                    }
                }
            }
            // Ensure required fields
            if (!args.guestName || !args.guestEmail || !args.guestPhone || !args.roomId || !args.checkIn || !args.checkOut) {
                const missing = ['guestName','guestEmail','guestPhone','roomId','checkIn','checkOut'].filter(f => !args[f]);
                return { success: false, error: `Missing required booking fields: ${missing.join(', ')}. Please collect all information before creating a booking.` };
            }
            console.log('Creating booking with normalized args:', JSON.stringify(args));
            // Use /api/bookings endpoint (Firebase Admin SDK) to reliably write to Firestore from server
            const bookingRes = await fetch(`${baseUrl}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args),
            });
            const bookingData = await bookingRes.json();
            if (!bookingData.success) {
                console.error('[createRoomBooking] /api/bookings failed:', bookingData.error);
                return { success: false, error: bookingData.error || 'Failed to save booking to database.' };
            }
            return { success: true, booking: bookingData.booking, message: `Booking confirmed! ID: ${bookingData.booking.id}` };
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
            const res = await fetch(`${baseUrl}/api/bookings`);
            const data = await res.json();
            const bookings = data.success ? data.bookings : [];
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
    // Derive base URL for internal API calls
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${proto}://${host}`;
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
        // Get today's date for context
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        
        let systemInstruction = 'You are Grand Hotel Assistant, a friendly and professional virtual concierge. ' +
            `Today's date is ${todayStr}. ` +
            'CRITICAL GUIDELINE: You must guide the guest by asking exactly ONE question at a time to gather details. ' +
            'Never ask multiple questions or request multiple pieces of information at once. ' +
            'Keep your responses extremely short, concise, and direct (maximum 1 or 2 sentences). Do not add conversational fluff or long introductions. ' +
            'When a guest wants to book a room: ' +
            '1. First ask for their Full Name (skip if user is authenticated). ' +
            '2. Then ask for their Phone Number. ' +
            '3. Then ask for their Email Address (skip if user is authenticated). ' +
            '4. Then ask for the Check-in date. Accept any format the guest provides (e.g. "June 10", "next Friday", "10/6"). ' +
            '5. Then ask for the Check-out date. Accept any format. ' +
            '6. Call listAvailableRooms to get available rooms, then ask which Room Type or specific Room Number they want from the available options. ' +
            '7. Then ask for the number of Guests. ' +
            'IMPORTANT DATE RULES: ' +
            '- Always convert guest-provided dates to strict YYYY-MM-DD format (e.g., "June 10" → "2026-06-10", "10/6" → "2026-06-10") before calling createRoomBooking. ' +
            '- If the guest says a date without a year, assume the current year or next year if the date has already passed. ' +
            '- Check-out must be strictly after check-in. If the guest provides invalid dates, ask them to clarify. ' +
            'Collect all of these 7 items one by one sequentially before executing the createRoomBooking tool. ' +
            'Once you have collected all info, call createRoomBooking immediately. If the tool returns success=true, confirm the booking with the ID. If it returns success=false, tell the guest there was an issue and ask for clarification. ' +
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
                    
                    const toolResult = await executeTool(name, args, origin, userContext);
                    
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
