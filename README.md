# grunt-jira-actions

> Grunt tasks to perform Jira actions.

## What You Can Do
* [Specify Jira connection properties](#setJiraConfig)
* [Create any type of Jira issue (Epic, Story, Bug, etc)](#createJiraIssue)
* [Transition issues to any state (Open, In Development, Closed, etc)](#transitionJiraIssue)
* [Add a comment to an existing issue](#addJiraComment)
* [Create a new Version in a Jira project](#createJiraVersion)

### Requirements

* Grunt `~0.4.5`
* API access to a Jira instance

### Installation

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jira-actions --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jira-actions');
```

## Performing Actions in Jira

### <a name="setJiraConfig"></a>Specify Jira Connection Properties

The following options are used by all Jira Action tasks:

- `env_var_for_jira_username` - Environment variable that holds Jira username. Default is 'JIRA_UN'.
- `env_var_for_jira_password` - Environment variable that holds Jira password. Default is 'JIRA_PW'.
- `jira_host` - Base domain of your Jira instance's api root (i.e. 'foo.atlassian.net').
- `jira_protocol` - The protocol which Jira's api uses for connections. Default is 'https'.
- `jira_port` - The port on which Jira's api allows connections on. Default is 443.
- `jira_api_version` - The version of Jira's api to target. Default is '2'.

These values can be:
* Set globaly using the `setJiraConfig` task
* Set in each task's top level options collection
* Set in each target's option collection

#### Example

```js

module.exports = function(grunt) {

  grunt.initConfig({

    // These values will be the defaults used in all Jira action tasks and targets
    setJiraConfig: {
      options: {
        env_var_for_jira_username: 'JIRA_UN',
        env_var_for_jira_password: 'JIRA_PW',
        jira_host: 'foo.atlassian.net',
        jira_protocol: 'https',
        jira_port: 443,
        jira_api_version: '2'
      }
    },

    // Multi-task for creating Jira stories
    createJiraIssue: {

      // Override global Jira config options with task specific options
      options: {
        env_var_for_jira_username: 'BAR_JIRA_UN',
        env_var_for_jira_password: 'BAR_JIRA_PW',
        jira_host: 'bar.atlassian.net',
        jira_protocol: 'http',
        jira_port: 80,
        jira_api_version: '2'
      },

      // Override global and task specific Jira config options with target specific options
      createFooStory: {
        options: {
          env_var_for_jira_username: 'BAZ_JIRA_UN',
          env_var_for_jira_password: 'BAZ_JIRA_PW',
          jira_host: 'baz.atlassian.net',
          jira_protocol: 'http',
          jira_port: 80,
          jira_api_version: '2'
        }
      }

    }

    // Load the task
    grunt.loadNpmTasks('grunt-jira-actions');

    // Call setJiraConfig, before any other Jira action tasks
    grunt.registerTask('default', ['setJiraConfig', 'createJiraIssue:createFooStory']);

  });
}

```

### <a name="createJiraIssue"></a>Creating Jira Issues with 'createJiraIssue'

In your project's Gruntfile, add a section named `createJiraIssue` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that add Jira issues of various types. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

#### Parameters specific to `createJiraIssue` targets

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
- `issue_state` - The transition id that the issue should end up in. Default is 1 which is Open. 2 is Closed.
- `summary` - Default is the project name specified in package.json (displayed in the story's subject)
- `description` - The description of the issue being created. If value is a valid file path, the contents of the file will be used (plain txt and JSON are supported).
- `optional_fields` - JSON to be added to the create issue call's fields JSON. For more details check [developer.atlassian.com](https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue)

#### Example

```js

grunt.initConfig({


    createJiraIssue: {

      // Declare options that are common to all Jira actions (or call setJiraConfig task before this one)
      options: {
        jira_host: 'bar.atlassian.net',
        project_id: 123456              // This will be common to all targets
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

### <a name="transitionJiraIssue"></a>Transition an Existing Jira Issue 'transitionJiraIssue'

The `transitionJiraIssue` task is called from other tasks, but can also be called directly using the format `grunt transitionJiraIssue:<issue_id>:<issue_state>`.

#### Parameters specific to `createJiraIssue` targets

- `issue_id` - Jira id of the issue that will be transitioned.
- `issue_state` - The transition id that the issue should end up in. Default is 1 which is Open. 2 is Closed.

#### Example

```shell

grunt transitionJiraIssue:19416:2

```


### <a name="addJiraComment"></a>Add Comments to Existing Issues with 'addJiraComment'

In your project's Gruntfile, add a section named `addJiraComment` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that will add Jira comments to existing issues. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

#### Parameters specific to `addJiraComment` target

- `issue_id` - Jira id of the project the story will be created in.
- `comment` - The body of the comment being added. If value is a valid file path, the contents of the file will be used (plain txt and JSON are supported).

#### Example

```js

grunt.initConfig({

    // Add comments to existing Jira issues
    addJiraComment: {

      // Declare options that are common to all Jira actions (or call setJiraConfig task before this one)
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


### <a name="createJiraVersion"></a>Create a Project Version with 'createJiraVersion'

In your project's Gruntfile, add a section named `createJiraVersion` to the data object passed into `grunt.initConfig()`. Within that section, you can create any number of targets that can be used to create project versions. Place common values in the top level options collection. Place target specific values in their respective target's option's collections.

#### Parameters specific to `createJiraVersion` target

- `project` - Jira's three letter project key (ex. 'FOO')
- `name` - String that will be used as the name of the version.
- `description` - The description of the Version being created. If value is a valid file path, the contents of the file will be used (plain txt and JSON are supported).
- `archived` - Boolean value indicating whether the version has been archived. Default is false.
- `released` - Boolean value indicating whether the version has been released. Default is false.
- `release_date` - Date on which the version was released. Default is the current date.

#### Example

```js

grunt.initConfig({

    // Create a Version of a Jira project
    createJiraVersion: {

      // Declare options that are common to all Jira actions (or call setJiraConfig task before this one)
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets for different Jira projects
      fooProject: {
        options: {
          project_key: 'FOO',
          name: 'New Version 1',
          description: 'This is the next version.',
          archived: false,
          released: true,
          release_date: '2015-02-21'
        }
      },

      // Create specific targets for different Jira projects
      barProject: {
        options: {
          project_key: 'BAR',
          name: 'New Version 1',
          description: 'test/data/version_description.txt',
          archived: false,
          released: true,
          release_date: '2015-02-21'
        }
      },
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
