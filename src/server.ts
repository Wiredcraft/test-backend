import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import { z } from "zod";


const server = fastify();
const prisma = new PrismaClient();

// Zod usado para validação da entrada
const userSchema = z.object({
    name: z.string(),
    dob: z.date(),
    address: z.string(),
    description: z.string(),
});

const userIdSchema = z.object({
    id: z.string(),
});


server.get("/users", async (request, reply) => {
    const users = await prisma.user.findMany();
    return { users };
}
);

server.get("/users/:id", async (request, reply) => {
    const userId = userIdSchema.parse(request.params);
    const user = await prisma.user.findUnique({
        where: {
            id: userId.id,
        },
    });
    return { user };
});

server.post("/users", async (request, reply) => {
    console.log(request.body);

    // o parse faz a validação e retorna um objeto com os campos validados
    const user = userSchema.parse(request.body);


    await prisma.user.create({
        data: {
            name: user.name,
            dob: user.dob,
            address: user.address,
            description: user.description,
        },
    });
    return reply.status(201).send();

});

server.put("/users/:id", async (request, reply) => {


    const userId = userIdSchema.parse(request.params);
    const user = userSchema.parse(request.body);

    await prisma.user.update({
        where: {
            id: userId.id,
        },
        data: {
            name: user.name,
            dob: user.dob,
            address: user.address,
            description: user.description,
        },
    });
    return reply.status(204).send();
});

server.delete("/users/:id", async (request, reply) => {
    const userId = userIdSchema.parse(request.params);
    await prisma.user.delete({
        where: {
            id: userId.id,
        },
    });
    return reply.status(204).send();
});


server.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then((address) => {
    console.log(`Server listening at ${address}`);
});