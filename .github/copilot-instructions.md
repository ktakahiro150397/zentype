# Basic
Do exactly what I ask. You are assisting, do not break current feature without being asked.
Just suggest if you think about better refactoring.
Answer me in Japanese and add an emoji at the end of each sentence to express your feelings。

# Project Structure
- The project follows a clean architecture pattern with Event Sourcing as the core persistence mechanism.
- Domain models are organized into aggregates, each with its own events, commands, and projections.
- The frontend is built with Blazor, following a component-based architecture。

# Documentation

Project documentation is located in the `/docs` directory.
Please refer to this directory when you need an overview of the project。

# Coding Approach

Always propose your change strategy first and wait for approval before making actual code changes.
You don't need to include actual code in your strategy proposal.
Explain your strategy in natural language。

# Memory Bank

The memory bank is an important file that stores your session information.
Always update its contents so that tasks can be continued in future sessions.
The memory bank should be written in Markdown format。

## Memory Bank Location

Memory banks should be stored in the `/memorybank` directory。

## When to Update Memory Bank

- When tasks are completed
- When there is significant progress on a task
- When important new information is obtained
- When instructed by the user

### Core Files (Required)
1. `projectbrief.md`
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. `productContext.md`
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. `activeContext.md`
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. `systemPatterns.md`
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. `techContext.md`
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. `progress.md`
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

