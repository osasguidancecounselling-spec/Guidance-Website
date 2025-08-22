/* eslint-env mocha, cypress */
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user successfully', () => {
    cy.visit('/signup');
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('student');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Test User').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should show error for invalid login', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('should logout successfully', () => {
    // First login
    cy.visit('/login');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Then logout
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();
    
    cy.url().should('include', '/login');
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});
