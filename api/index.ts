
// FIX: Correctly import PrismaClient.
import { PrismaClient } from '@prisma/client';
// FIX: Correctly import express and its types (Request, Response, NextFunction).
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- Simple Auth Middleware ---
// NOTE: This is a simplified auth check as requested.
// In a production environment, you should validate the token against Google's servers.
// FIX: Use explicit express types to avoid conflicts with global types.
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;

    if (!userId || !userRole) {
        return res.status(401).json({ message: 'Unauthorized: Missing user headers' });
    }
    
    // Attach user info to the request object for use in handlers
    // @ts-ignore
    req.user = { id: userId, role: userRole };
    
    next();
};

// FIX: Use explicit express types to avoid conflicts with global types.
const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};


// --- API Routes ---

// -- Settings --
// FIX: Use explicit express types to avoid conflicts with global types.
app.get('/api/settings', async (req: Request, res: Response) => {
    try {
        let settings = await prisma.settings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = await prisma.settings.create({ data: { id: 1 } });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
});

// FIX: Use explicit express types to avoid conflicts with global types.
app.post('/api/settings', authMiddleware, adminOnly, async (req: Request, res: Response) => {
    try {
        const { bookingEnabled, careChatEnabled } = req.body;
        const settings = await prisma.settings.upsert({
            where: { id: 1 },
            update: { bookingEnabled, careChatEnabled },
            create: { id: 1, bookingEnabled, careChatEnabled },
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error });
    }
});

// -- Artists --
// FIX: Use explicit express types to avoid conflicts with global types.
app.get('/api/artists', async (req: Request, res: Response) => {
    try {
        const artists = await prisma.tattooArtist.findMany();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artists', error });
    }
});

// FIX: Use explicit express types to avoid conflicts with global types.
app.post('/api/artists', authMiddleware, adminOnly, async (req: Request, res: Response) => {
    try {
        const { id, ...data } = req.body;
        if (id) {
            const artist = await prisma.tattooArtist.update({ where: { id }, data });
            res.json(artist);
        } else {
            const artist = await prisma.tattooArtist.create({ data });
            res.json(artist);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating/updating artist', error });
    }
});

// -- Appointments --
// FIX: Use explicit express types to avoid conflicts with global types.
app.get('/api/appointments', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { userId, status } = req.query;
        // @ts-ignore
        const requestingUser = req.user;

        const where: any = {};
        if (status) where.status = status as string;

        // Clients can only see their own appointments
        if (requestingUser.role === 'client') {
            where.clientId = requestingUser.id;
        } else if (userId) { // Admins can filter by userId
             where.clientId = userId as string;
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: { client: true, artist: true },
            orderBy: { date: 'asc' },
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});

// FIX: Use explicit express types to avoid conflicts with global types.
app.post('/api/appointments', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { clientId, artistId, date, time, description } = req.body;
        const newAppointment = await prisma.appointment.create({
            data: {
                clientId,
                artistId,
                date: new Date(date),
                time,
                description,
            },
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error });
    }
});

// FIX: Use explicit express types to avoid conflicts with global types.
app.patch('/api/appointments/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, price, commissionAdjustment, adjustmentNotes } = req.body;
        const updatedAppointment = await prisma.appointment.update({
            where: { id: String(id) },
            data: { status, price, commissionAdjustment, adjustmentNotes },
        });
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
});

// -- Gemini Chat --
const systemInstruction = `Você é um assistente de IA especialista para o Maddock Tattoo, um estúdio profissional de tatuagem e piercing.
Seu ÚNICO propósito é fornecer conselhos claros, seguros e úteis sobre cuidados pós-tatuagem e pós-piercing.
- Você deve APENAS responder a perguntas diretamente relacionadas à cicatrização de tatuagens, cuidados com piercings, procedimentos de limpeza, identificação de possíveis problemas (como infecções, direcionando-os a procurar um médico) e recomendação de produtos apropriados.
- Se um usuário fizer uma pergunta sobre QUALQUER outro tópico (por exemplo, ideias de tatuagens, preços, agendamento, notícias, programação, etc.), você DEVE educadamente recusar e afirmar que sua única função é ajudar com os cuidados posteriores.
- Seu tom deve ser profissional, tranquilizador e fácil de entender. Evite jargão excessivamente técnico.
- Comece sua primeira mensagem com uma saudação amigável como "Bem-vindo(a) ao Assistente de Pós-Cuidado da Maddock Tattoo! Como posso ajudar com sua nova tatuagem ou piercing hoje?".
- Nunca dê conselhos médicos que devam vir de um médico. Se um usuário descrever sintomas graves (por exemplo, febre alta, pus, estrias vermelhas), sua resposta principal deve ser aconselhá-lo a entrar em contato com um profissional médico imediatamente.`;

app.get('/api/chat/greeting', (req: Request, res: Response) => {
    res.json({ text: "Bem-vindo(a) ao Assistente de Pós-Cuidado da Maddock Tattoo! Como posso ajudar com sua nova tatuagem ou piercing hoje?" });
});

// FIX: Use explicit express types to avoid conflicts with global types.
app.post('/api/chat', authMiddleware, async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'AI service is not configured.' });
    }
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({ message: 'Error communicating with AI assistant' });
    }
});

// This is the Vercel export
export default app;