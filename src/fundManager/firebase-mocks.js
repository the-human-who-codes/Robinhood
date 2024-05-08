// firebase-mocks.js
export const firebaseAppMock = {
    initializeApp: jest.fn(),
  };
  
  export const firebaseDatabaseMock = {
    getDatabase: jest.fn(),
    ref: jest.fn(),
    push: jest.fn(),
    set: jest.fn(),
  };