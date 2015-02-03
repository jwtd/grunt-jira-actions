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

## The "jiraActions" task

### Overview
In your project's Gruntfile, add a section named `jiraActions` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({

  jiraActions: {
    createStory {
      options: {
        jira: {
          api_url: "https://company.atlassian.net/rest/api/2/",
          proxy : null,
          user: "user",
          password: "password",
          issue_type: 3,   // Task
          done_state: 11   // Done state
        },
        project: {
          project_id: 12100,
          name: "Foo Project",
          version: "1.0.1",
          build_label: "foo_project_1.0.1.12345"
        },
        story: {
          subject: "Foo Project",
          body: release-manifest.json,
          state: 11 // Done
        }
      }
    }
  }

});
```

### Options

- `jira`
    - `api_url` - Url of the Jira api root
    - `proxy` - Full url of proxy including port
    - `user` - Jira username. Default value is process.env.JIRA_UN
    - `password`  - Jira password. Default value is process.env.JIRA_PW
- `project` - Default values are those specified in package.json
    - `jira_id` - Jira id of the project the story will be created in
    - `name` - Default is the project name specified in package.json (displayed in the story's subject)
    - `build_label` - The build that created this story
- `issue` - The details of the story being created
    - `type` - Jira id of the type of issue to post the story as
        1 = Bug
        2 = New Feature
        3 = Task
        4 = Improvement
        5 = Sub-task
        6 = Epic
        7 = Story
        8 = Technical Task
    - `subject` - Default is the project name specified in package.json (displayed in the story's subject)
    - `body` - Path to a file whose contents will be the body of the story
    - `state` - The transition id that the story should end up in. Default is 1 which is 'open'

## Contact, feedback and bugs

This interface was not developed or reviewed by Atlassian or OpenTable. They bare no responsibility for its quality, performance, or results. Use at your own risk.

Please file bugs / issues and feature requests on the [issue tracker](https://github.com/jwtd/grunt-jira-actions/issues)

## Contributing
The code styleguide for this project is captured in the [eslint.json](https://github.com/jwtd/grunt-jira-actions/blob/master/eslint.json) file. Submissions should be accompanied by unit tests for any new or changed functionality. [esLint](http://eslint.org/) and test your code using [Grunt](http://gruntjs.com/).

## Special Thanks
* Ryan Tomlinson for the helpful write up of [OpenTable's release process](http://tech.opentable.co.uk/blog/2014/05/19/continuous-delivery-automating-deployment-visibility/)
* [OpenTable](https://github.com/opentable) - for being a progressive organization and allowing their staff to open source their tools.
* [OpenTable](https://github.com/opentable) - for being a progressive organization and allowing their staff to open source their tools.
* [Chris Riddle](https://github.com/christriddle) and [Bryce Catlin](https://github.com/bcatlin) for putting together [grunt-ccb](https://github.com/opentable/grunt-ccb), which this project is derived from.


## Release History
_(Nothing yet)_
