export const userSchema = {
    title: 'usersSchema',
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        dob: { type: 'string' },
        address: { type: 'string' },
        description: { type: 'string' },
        updatedAt: { type: ['null', 'string'] },
    },
}