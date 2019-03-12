/* Describes how each issue from the Github API is formatted
Note: Assessment wants to display the title, body, user login, and assignee.
*/

export interface IssueUser {
  // Identifiers
  node_id: string,
  id:    number,
  login: string,
  // Icons
  avatar_url:  string,
  gravatar_id: string,
  // Content
  site_admin: boolean,
  type: string,
  
  // URLS
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url:   string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url:  string,
  events_url: string,
  received_events_url: string
}

export interface Issue {
  // Identifiers
  node_id: string;
  id: number;
  number: number; // Is a part of the URL
  title:  string;
  
  // Content
  labels: any;
  locked: boolean;
  state:  string;
  milestone: any;
  body:      string
  comments:  number; // As in... the number of comments
  pull_request: any;
  // Dates
  created_at: string;
  updated_at: string;
  closed_at:  any;
  
  // URLS
  url: string;
  repository_url: string;
  labels_url:   string;
  comments_url: string;
  events_url: string;
  html_url:   string;
  
  // Associations
  user: IssueUser; // TODO?
  assignee:  IssueUser; // TODO?
  assignees: IssueUser[]; // TODO?
  author_association: string
}