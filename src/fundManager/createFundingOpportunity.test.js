import { createFundingOpportunity, handleSubmit } from './createFundingOpportunity.js';
import * as firebase from 'firebase/app'; // Import Firebase methods as named imports
import 'firebase/database';

// Mock Firebase database
jest.mock("firebase/database", () => {
    const mockRef = {
        push: jest.fn(() => ({ key: 'newKey' })),
    };

    const mockDatabase = {
        ref: jest.fn(() => mockRef),
    };

    const mockGetDatabase = jest.fn(() => ({
        ref: jest.fn(() => mockRef),
    }));

    return {
        getDatabase: mockGetDatabase,
    };
});

// Mock console.log
global.console.log = jest.fn();

// Mock createFundingOpportunity function
jest.mock("./createFundingOpportunity.js", () => ({
    createFundingOpportunity: jest.fn(),
}));

describe('createFundingOpportunity', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <!doctype html>
        <html>
            <head></head>
            <body>
                <main>
                    <form id="fundingOpportunityForm">
                        <div>
                            <label for="title">Name of Company:</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div>
                            <label for="description">Description of Funding Opportunity:</label>
                            <textarea id="description" name="description" rows="4" required></textarea>
                        </div>
                        <div>
                            <label for="deadline">Deadline of Funding Opportunity:</label>
                            <input type="date" id="deadline" name="deadline" required>
                        </div>
                        <div>
                            <label for="motivation">Motivation:</label>
                            <input type="text" id="motivation" name="motivation" required>
                        </div>
                        <a href="#" onclick="Create()"><button type="submit">Submit</button> </a>
                    </form>
                </main>
            </body>
        </html>
        `;

        const user = { uid: 'testUid' };
        sessionStorage.setItem('user', JSON.stringify(user));
    });

    it('creates a new funding opportunity', async () => {
        const title = 'Test title';
        const description = 'Test description';
        const deadline = 'Test deadline';
        const motivation = 'Test motivation';
        const uid = 'testUid';

        await createFundingOpportunity(title, description, deadline, motivation, uid);

       
       // expect(console.log).toHaveBeenCalledWith('New funding opportunity created:', 'newKey');
    });
});

describe('handleSubmit', () => {
    it('calls createFundingOpportunity with correct parameters', async () => {
        const form = document.querySelector('#fundingOpportunityForm');

        // Mock the createFundingOpportunity function
        createFundingOpportunity.mockResolvedValueOnce(undefined);

        // Trigger form submission
        form.dispatchEvent(new Event('submit'));

        // Wait for the promise to resolve
        await Promise.resolve();

        expect(createFundingOpportunity).toHaveBeenCalledWith(
            'Test title',
            'Test description',
            'Test deadline',
            'Test motivation',
            'testUid'
        );
    });
});
