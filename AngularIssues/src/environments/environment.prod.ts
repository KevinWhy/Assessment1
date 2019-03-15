export const environment = {
  production: true,
  useCachedResponses: false, // Github Issues API has a low limit. This flag has the IssueService return cached data instead
  repoOwner: 'angular',
  repoName: 'angular',
  
  cachedIssuesUrl: 'assets/savedIssuesResponse.json',
};
