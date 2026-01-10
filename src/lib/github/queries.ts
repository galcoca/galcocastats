export const PROFILE_STATS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      name
      login
      followers {
        totalCount
      }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        totalCount
        nodes {
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
      pullRequests(first: 1) {
        totalCount
      }
      issues(first: 1) {
        totalCount
      }
    }
  }
`

export const LANGUAGES_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST], includeUserRepositories: false) {
        nodes {
          name
          owner {
            login
          }
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`

export const CONTRIBUTION_CALENDAR_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`

export const CONTRIBUTION_YEARS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionYears
      }
    }
  }
`

export const COMMIT_TIMES_QUERY = `
  query($login: String!, $owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, author: {id: null}) {
              nodes {
                committedDate
                author {
                  user {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const USER_REPOS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(ownerAffiliations: OWNER, first: 20, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          name
          owner {
            login
          }
        }
      }
    }
  }
`
