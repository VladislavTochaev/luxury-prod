# PROD 2026 - Frontend. Frequently Asked Questions

[[_TOC_]]

## Where is the task?

[Task description in English.](task-en.md)

## Where to place my code?

In your personal repository created via [System](https://contest.gitlab.prodcontest.com).

> [!WARNING]
> Remember! All changes must be strictly within the `solution` directory and in the `main` branch!\
> Any files outside the `solution` directory are protected from changes.\
> The file `solution/data.json` is also protected from modifications.

## How to run the project?

1. [Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
2. Install [Node.js](https://nodejs.org/en/download) on your device. Version 24.12 or higher is recommended. If the installation was successful, the following commands in the terminal will display the installed version numbers:
```
node -v
npm -v
```
3. Before the first launch, open the terminal, navigate to the repository folder, and run the command `npm ci`. If the installation was successful, the `node_modules` directory will appear in the folder.
4. Run the project using the command `npm run start`. Open http://localhost:8080/ in your browser — if the project started successfully, you will see a tab titled "PROD 2". This is your solution.

For subsequent runs, simply use the `npm run start` command.

## How to run the open tests?

There are two options:
- Running with an interactive interface, where you can visually explore test execution.
- Running via Docker, which uses an environment similar to remote checks.

### Running with an interactive interface

First, complete steps 1–3 from [How to run the project?](#how-to-run-the-project)

1. Before the first run, install dependencies using the command `npx playwright install`
2. Launch the [interface](https://playwright.dev/docs/test-ui-mode) with the command `npm run test:ui` and use it.

### Running via Docker

1. Install [Docker](https://docs.docker.com/get-started/introduction/get-docker-desktop/)
2. To run the tests, execute the following commands in the terminal:
```
docker build -t prod-task-2-tests .
docker run -it --rm -v "$(pwd)/test-results:/test-results" prod-task-2-tests
```
3. If some checks fail during execution, a folder named test-results will appear, containing error details.

> [!WARNING]
> Screenshot tests should be verified using Docker!
