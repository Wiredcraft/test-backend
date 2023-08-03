import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
    {
        name: "Maxson Almeida",
        dob: "1994-10-14",
        address: "Rua dos Comerciarios, Numero 3 ",
        description: "É UM DESENVOLVER BACKEND",
    },
    {
        name: "Maxson Almeida",
        dob: "1994-10-14",
        address: "Rua dos Comerciarios, Numero 3 ",
        description: "É UM DESENVOLVER BACKEND",
    }
];

async function main() {
    console.log(`Start seeding ...`);
    for (const u of users) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await console.log(`Seeding finished.`);
    }
    )
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    }
    )
    .finally(async () => {
        await prisma.$disconnect();
    }
    );
