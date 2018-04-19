import request from 'supertest'
import app, {COMMAND} from '../src/app'

//reference from slack docs
let slackExample = {
    token: "gIkuvaNzQIHg97ATvDxqgjtO",
    team_id: "T0001",
    team_domain: "example",
    enterprise_id: "E0001",
    enterprise_name: "Globular%20Construct%20Inc",
    channel_id: "C2147483705",
    channel_name: "test",
    user_id: "U2147483697",
    user_name: "Steve",
    command: "/weather",
    text: "94070",
    response_url: "https://hooks.slack.com/commands/1234/5678",
    trigger_id: "13345224609.738474920.8088930838d88f008e0",
}

describe('Test the root path', () => {
    test('Should require the token field', async () => {
        const response = await request(app).post('/').type('form').send({});
        expect(response.statusCode).toBe(422);
        expect(response.text).toBe("token must be present");
    });
    test('Should require the command field', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc"});
        expect(response.statusCode).toBe(422);
        expect(response.text).toBe("command must be present");

    });
    test('Should only accept the default command', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'help'});
        expect(response.statusCode).toBe(200);
    });
    test('help operation should return help text', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'help'});
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("help");
    });
    test('balance operation should return balance', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'balance'});
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("balance");
    });
    test('transfer operation should return transfer', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'transfer'});
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("transfer");
    });
    test('export operation should return export', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'export'});
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("export");
    });
    test('undefined operation should be unprocessable', async () => {
        const response = await request(app).post('/').type('form').send({token: "abc", command: COMMAND, text: 'foo'});
        expect(response.statusCode).toBe(422);
        expect(response.text).toBe('operation "foo" not found');
    });
})