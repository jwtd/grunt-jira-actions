# grunt-jira-actions

> Grunt tasks to perform Jira actions

## Getting Started
This plugin requires Grunt `~0.4.5`

### Requirements

* Grunt `~0.4.5`
* API access to a Jira instance

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jira-actions --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jira-actions');
```

## Parameters Common to All Tasks
- `env_var_for_jira_username` - Environment variable that holds Jira username. Default is 'JIRA_UN'.
- `env_var_for_jira_password` - Environment variable that holds Jira password. Default is 'JIRA_PW'.
- `jira_host` - Base domain of your Jira instance's api root (i.e. 'foo.atlassian.net').
- `jira_protocol` - The protocol which Jira's api uses for connections. Default is 'https'.
- `jira_port` - The port on which Jira's api allows connections on. Default is 443.
- `jira_api_version` - The version of Jira's api to target. Default is '2'.


## Creating Jira Issues with 'createJiraIssue'

In your project's Gruntfile, add a section named `createJiraIssue` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that add Jira issues of various types. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

### Parameters specific to `createJiraIssue` target
- `project_id` - Jira id of the project the story will be created in.
- `issue_type` - Jira name of the type of issue to be created. Default is 'Story'. Valid values are:
 - Bug
 - New Feature
 - Task
 - Improvement
 - Sub-task
 - Epic
 - Story
 - Technical Task
- `issue_state` - The transition id that the story should end up in. Default is 1 which is Open. 2 is Closed.
- `summary` - Default is the project name specified in package.json (displayed in the story's subject)
- `description` - The description of the issue being created. If value is a valid file path, the contents of the file will be used (plain txt and JSON are supported).
- `optional_fields` - JSON to be added to the create issue call's fields JSON. For more details check [developer.atlassian.com](https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue)

### Example

```js
grunt.initConfig({

    // Create Jira issues
    createJiraIssue: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net',
        project_id: 123456
      },

      // Create specific targets to perform different Jira tasks
      createAndCloseFooStory: {
        options: {
          issue_type: 'Story', // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
          issue_state: 1,      // 1 = Open, 2 = Done
          summary: 'This is the foo story summary',
          description: 'This is the foo story description.'
        }
      },

      // Create specific targets to perform different Jira tasks
      createOpenBarTask: {
        options: {
          issue_type: 'Task',
          issue_state: 2,      // 1 = Open, 2 = Done
          summary: 'This is the bar task summary',
          description: 'test/data/issue_body.txt',  // Import contents of file as description
          optional_fields: {
            'priority': {
              'name': 'Major'  // Specify priority - Critical, Major, Medium (default), Minor
            },
            'components': [{
              'id': '56789'    // Specify a component
            }]
          }
        }
      }

    }

});
```
## Add Comments to Existing Issues with 'addJiraComment'

In your project's Gruntfile, add a section named `addJiraComment` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that will add Jira comments to existing issues. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

### Parameters specific to `addJiraComment` target
- `issue_id` - Jira id of the project the story will be created in.
- `comment` - The body of the comment being added. If value is a valid file path, the contents of the file will be used (plain txt and JSON are supported).

### Example

```js
grunt.initConfig({

    // Add comments to existing Jira issues
    addJiraComment: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'foo.atlassian.net'
      },

      // Create specific targets to perform different Jira tasks
      onIssue: {
        options: {
          // issue_id: This value will be passed in via target call such as addJiraComment:onIssue:19400
          comment: 'This is a comment on the story.'
        }
      },

      // Create specific targets to perform different Jira tasks
      fromFileToIssue: {
        options: {
          // issue_id: This value will be passed in via target call such as addJiraComment:fromFileToIssue:19400
          comment: 'test/data/comment_body.txt'
        }
      }

    }

});
```

## Contact, feedback and bugs

This interface was not developed or reviewed by Atlassian. They bare no responsibility for its quality, performance, or results. Use at your own risk.

Please file bugs / issues and feature requests on the [issue tracker](https://github.com/jwtd/grunt-jira-actions/issues)

## Contributing
The code styleguide for this project is captured in the [eslint.json](https://github.com/jwtd/grunt-jira-actions/blob/master/eslint.json) file. Submissions should be accompanied by unit tests for any new or changed functionality. [esLint](http://eslint.org/) and test your code using [Grunt](http://gruntjs.com/).

## Special Thanks
* Ryan Tomlinson for the helpful write up of [OpenTable's release process](http://tech.opentable.co.uk/blog/2014/05/19/continuous-delivery-automating-deployment-visibility/)
* [OpenTable](https://github.com/opentable) - for being a progressive organization and allowing their staff to open source their tools.
* [Chris Riddle](https://github.com/christriddle) and [Bryce Catlin](https://github.com/bcatlin) for putting together [grunt-ccb](https://github.com/opentable/grunt-ccb), which this project is derived from.


## Release History
_(Nothing yet)_
