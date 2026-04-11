# ade — agentic dev environment

Personal scripts for running Claude Code agents in git worktrees with tmux.

## Scripts

### `wt` — worktree switcher

Navigate between git worktrees with fuzzy matching and an fzf picker.

```
wt              # interactive fzf picker
wt <name>       # switch to worktree matching name/branch (fuzzy)
wt add <url>    # create a new worktree from a GitHub issue URL or description
```

`wt add` calls `wt-name` to generate the branch slug via Claude, then creates the worktree and switches to it. Inside tmux it sends `cd` to the current window; outside tmux it `exec`s a new shell in the target directory.

### `wt-name` — AI branch name generator

Generates a `pp-<verb>-<slug>` branch name from a description or GitHub issue URL.

```
wt-name "add dark mode support"
wt-name https://github.com/owner/repo/issues/123
echo "fix login bug" | wt-name
```

For GitHub issue URLs, fetches the title, labels, and body via `gh` to produce a more accurate slug. Uses `claude-haiku` to generate the slug.

### `code` — start a Claude Code session

Launches (or relaunches) a named tmux session for the current worktree with three windows:

| Window | Name | Contents |
|--------|------|----------|
| 1 | `agent` | Claude Code (`--dangerously-skip-permissions --continue`) |
| 2 | `review` | `tuicr` (TUI code review) |
| 3 | `terminal` | Plain shell |

Must be run from inside a linked worktree (not the main worktree).

## Dependencies

| Tool | Purpose |
|------|---------|
| `git` | Worktree management |
| `fzf` | Interactive picker in `wt` |
| `tmux` | Session management in `code` |
| `claude` | Claude Code CLI — used by `code` and `wt-name` |
| `gh` | GitHub CLI — used by `wt-name` for issue lookups |
| `jq` | JSON parsing in `wt-name` |
| `tuicr` | TUI code review in `code` |

## Install

Clone the repo and symlink the scripts into a directory on your `$PATH`:

```bash
git clone https://github.com/peterp/ade ~/gh/peterp/ade
mkdir -p ~/.local/bin
ln -s ~/gh/peterp/ade/wt       ~/.local/bin/wt
ln -s ~/gh/peterp/ade/wt-name  ~/.local/bin/wt-name
ln -s ~/gh/peterp/ade/code     ~/.local/bin/code
```

Make sure `~/.local/bin` is on your `$PATH` (add to `~/.zshrc` or `~/.bashrc` if needed):

```bash
export PATH="$HOME/.local/bin:$PATH"
```
