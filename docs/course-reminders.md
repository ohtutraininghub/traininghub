# Scheduled course reminders

### Scheduling with GitHub Actions

[GitHub Actions Documentation about scheduling](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

Daily course reminders are scheduled with GitHub Actions [reminder workflow](.github/workflows/reminder.yml). Once a day (currently set to 6.00 UTC) the workflow calls for the /api/reminder route and the call is authorized with Bearer token. After successful authorization, the function responsible for checking upcoming courses and sending reminders on Slack is called.

In the [production setup guide](./production-setup-guide.md) are instructions for setting up API URL and authentication token.

#### Important notes from the GitHub Actions documentation

- This event will only trigger a workflow run if the workflow file is on the default branch.
- Scheduled workflows will only run on the default branch.
- In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days. For information on re-enabling a disabled workflow, see [Disabling and enabling a workflow](https://docs.github.com/en/enterprise-server@3.12/actions/using-workflows/disabling-and-enabling-a-workflow#enabling-a-workflow).

#### Why GitHub Actions

Previously the implementation was tried to do with [node-cron](https://www.npmjs.com/package/node-cron). However, using node-cron with this application turned out to be very tricky. In the context of this application, there isn't a server file, that remains running indefinitely. Hence, it was necessary to try and run the cron-job directly with node but practical way to implement that wasn't found.

Other ways to implement the scheduling were researched but there didn't seem to be any libraries or other free solutions to implement the scheduling inside the application. This is why the GitHub Actions was seen as the best available solution for scheduling.
