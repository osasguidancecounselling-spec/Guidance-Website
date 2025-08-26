/* eslint-env mocha, cypress */

// Use a unique identifier for the test user to avoid conflicts
const testTimestamp = Date.now();
const studentNumber = `2024${testTimestamp.toString().slice(-6)}`;
const studentEmail = `student${testTimestamp}@test.com`;
const studentPassword = 'Password123!';

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Start from the root before each test
    cy.visit('/'); 
  });

  it('should prevent login with invalid credentials', () => {
    cy.get('input[placeholder="Student Number"]').type('invalid-student-number');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });

  it('should register a new student successfully', () => {
    cy.visit('/signup');
    
    // Fill out the form
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('Student');
    cy.get('input[name="studentNumber"]').type(studentNumber);
    cy.get('input[name="email"]').type(studentEmail);
    cy.get('select[name="course"]').select('BS Computer Science');
    cy.get('select[name="year"]').select('1st Year');
    cy.get('select[name="section"]').select('A');
    cy.get('input[name="answer1"]').type('Buddy');
    cy.get('input[name="answer2"]').type('Pizza');
    cy.get('input[name="answer3"]').type('Testville');
    cy.get('input[name="password"]').type(studentPassword);
    cy.get('input[name="confirmPassword"]').type(studentPassword);
    
    cy.get('button[type="submit"]').click();
    
    // Check for success message and redirection
    cy.contains('Account created successfully!').should('be.visible');
    cy.url().should('include', '/dashboard');
  });

  it('should login the new student and then logout', () => {
    // To make this test independent, we programmatically create the user first.
    // This is faster and more reliable than relying on the UI registration test.
    const loginUserNumber = `login${testTimestamp}`;
    cy.request('POST', `${Cypress.env('API_URL') || 'http://localhost:5000'}/api/auth/register`, {
      name: 'Login Test Student',
      email: `login-test-${testTimestamp}@test.com`,
      password: studentPassword,
      studentNumber: loginUserNumber,
      course: 'BS Computer Science',
      year: '1st Year',
      section: 'A',
      securityQuestions: {
        question1: "Q1", answer1: "A1",
        question2: "Q2", answer2: "A2",
        question3: "Q3", answer3: "A3",
      },
    });
    cy.get('input[placeholder="Student Number"]').type(loginUserNumber);
    cy.get('input[placeholder="Password"]').type(studentPassword);
    cy.get('button[type="submit"]').click();
    
    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Logout
    // This selector is more robust and will find a logout button or link.
    // Please ensure you have a logout element in your UI.
    cy.get('button, a').contains(/logout/i).click();
    cy.url().should('not.include', '/dashboard');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should allow a student to reset their password and login with the new password', () => {
    // Create a dedicated user for this test to ensure it runs independently.
    const resetUserNumber = `reset${testTimestamp}`;
    cy.request('POST', `${Cypress.env('API_URL') || 'http://localhost:5000'}/api/auth/register`, {
      name: 'Reset Test Student',
      email: `reset-test-${testTimestamp}@test.com`,
      password: studentPassword,
      studentNumber: resetUserNumber,
      course: 'BS Information Technology',
      year: '2nd Year',
      section: 'B',
      securityQuestions: {
        question1: "What is your pet's name?", answer1: 'Buddy',
        question2: 'What is your favorite food?', answer2: 'Pizza',
        question3: 'What city were you born in?', answer3: 'Testville',
      },
    });
    const newPassword = 'NewPassword456!';

    // --- Step 1: Find Student ---
    cy.visit('/forgot-password');
    cy.get('input[placeholder="Student Number"]').type(resetUserNumber);
    cy.get('button').contains('Continue').click();

    // --- Step 2: Verify Security Answers ---
    cy.contains('Answer your security questions').should('be.visible');
    cy.get('input[placeholder="Enter your answer"]').eq(0).type('Buddy');
    cy.get('input[placeholder="Enter your answer"]').eq(1).type('Pizza');
    cy.get('input[placeholder="Enter your answer"]').eq(2).type('Testville');
    cy.get('button').contains('Verify Answers').click();

    // --- Step 3: Reset Password ---
    cy.contains('Create your new password').should('be.visible');
    cy.get('input[placeholder="Enter New Password"]').type(newPassword);
    cy.get('input[placeholder="Re-enter New Password"]').type(newPassword);
    cy.get('button').contains('Save New Password').click();

    // --- Step 4: Verify Success and Login ---
    cy.contains('Password has been reset successfully').should('be.visible');
    cy.get('a').contains('Back to Login').click();
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Attempt login with the new password
    cy.get('input[placeholder="Student Number"]').type(resetUserNumber);
    cy.get('input[placeholder="Password"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/dashboard');
    cy.url().should('not.include', '/dashboard');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should allow admin to login', () => {
    cy.get('button').contains('Admin').click();
    cy.get('input[placeholder="Email"]').type(Cypress.env('ADMIN_EMAIL') || 'admin@example.com');
    cy.get('input[placeholder="Password"]').type(Cypress.env('ADMIN_PASSWORD') || 'adminpassword');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });
});
