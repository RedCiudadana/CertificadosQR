'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GithubIcon, ExternalLink } from 'lucide-react';

interface GitHubStepProps {
  githubConfig: {
    username: string;
    repo: string;
  };
  setGithubConfig: React.Dispatch<React.SetStateAction<{
    username: string;
    repo: string;
  }>>;
}

export function GitHubStep({ githubConfig, setGithubConfig }: GitHubStepProps) {
  const [baseUrl, setBaseUrl] = useState<string>('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setGithubConfig({ ...githubConfig, username });
    updateBaseUrl(username, githubConfig.repo);
  };

  const handleRepoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const repo = e.target.value;
    setGithubConfig({ ...githubConfig, repo });
    updateBaseUrl(githubConfig.username, repo);
  };

  const updateBaseUrl = (username: string, repo: string) => {
    if (username && repo) {
      setBaseUrl(`https://${username}.github.io/${repo}`);
    } else {
      setBaseUrl('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">GitHub Configuration</h2>
          <p className="text-muted-foreground">
            Enter your GitHub details to host certificates and enable verification via GitHub Pages.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="github-username">GitHub Username</Label>
            <div className="flex">
              <div className="flex items-center px-3 border rounded-l-md bg-muted">
                <GithubIcon className="h-4 w-4" />
              </div>
              <Input
                id="github-username"
                placeholder="yourusername"
                value={githubConfig.username}
                onChange={handleUsernameChange}
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your GitHub username (e.g., cbitosc)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github-repo">Repository Name</Label>
            <Input
              id="github-repo"
              placeholder="certificate-repo"
              value={githubConfig.repo}
              onChange={handleRepoChange}
            />
            <p className="text-xs text-muted-foreground">
              The name of your GitHub repository (e.g., qr-certificates)
            </p>
          </div>

          {baseUrl && (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium">Your certificates will be hosted at:</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-blue-600 dark:text-blue-400">{baseUrl}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(baseUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setting Up GitHub Pages:</h3>
          <ol className="list-decimal pl-6 space-y-3 text-sm text-muted-foreground">
            <li>
              <p className="font-medium">Create a repository on GitHub</p>
              <p>If you don't have one already, create a new public repository on GitHub.</p>
            </li>
            <li>
              <p className="font-medium">Enable GitHub Pages</p>
              <p>Go to repository Settings → Pages → and select the "main" branch with "/docs" folder.</p>
            </li>
            <li>
              <p className="font-medium">Upload generated certificates</p>
              <p>After generating certificates, upload the "docs" folder to your repository.</p>
            </li>
            <li>
              <p className="font-medium">Verify deployment</p>
              <p>GitHub Pages will automatically deploy your certificates, making them accessible via QR codes.</p>
            </li>
          </ol>

          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://github.com/new', '_blank')}
            >
              <GithubIcon className="h-4 w-4" />
              Create a GitHub Repository
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}