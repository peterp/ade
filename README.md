# ade — agentic dev environment

Personal scripts for running pi coding agents in git worktrees with tmux.

## Scripts

### `wt` — worktree switcher

Navigate between git worktrees with fuzzy matching and an fzf picker.

```
wt              # interactive fzf picker
wt <name>       # switch to worktree matching name/branch (fuzzy)
wt add <url>    # create a new worktree from a GitHub issue URL or description
wt add -r <branch>  # use branch name as-is, skip AI name generation
```

`wt add` calls `wt-name` to generate the branch slug via Claude, then creates the worktree and switches to it. Inside tmux it sends `cd` to the current window; outside tmux it `exec`s a new shell in the target directory. Pass `-r` / `--raw` to skip name generation and use your input directly as the branch name.

### `wt-name` — AI branch name generator

Generates a `pp-<verb>-<slug>` branch name from a description or GitHub issue URL.

```
wt-name "add dark mode support"
wt-name https://github.com/owner/repo/issues/123
echo "fix login bug" | wt-name
```

For GitHub issue URLs, fetches the title, labels, and body via `gh` to produce a more accurate slug. Uses `claude-haiku` to generate the slug.

### `code` — start a pi session

Launches (or relaunches) a named tmux session for the current worktree with four windows:

| Window | Name | Contents |
|--------|------|----------|
| 1 | `proxy` | `meridian` — local Anthropic-compatible proxy backed by your Claude Max subscription |
| 2 | `agent` | `pi` launched with `ANTHROPIC_BASE_URL=http://127.0.0.1:3456`, pointed at meridian |
| 3 | `review` | `tuicr` (TUI code review) |
| 4 | `terminal` | Plain shell |

The agent window waits for the meridian port to open before starting `pi`. If meridian is already running on the port (from another session), the proxy window skips launching a second instance.

Must be run from inside a linked worktree (not the main worktree). Before first use, authenticate meridian once: `claude login` (see [meridian](https://github.com/rynfar/meridian) for details). Override the port with `MERIDIAN_PORT=...`.

### `pi` — run pi standalone

Runs `pi` routed through meridian without tmux or a worktree. Auto-starts meridian in the background if nothing is bound to `:$MERIDIAN_PORT` (default `3456`); logs go to `$TMPDIR/meridian-<port>.log`.

```
pi              # launch pi
pi <args>       # forwards args to pi
```

## Recommended setup

Use [cmux](https://github.com/nicm/cmux) as your terminal for the best tmux integration experience.

## Dependencies

| Tool | Purpose |
|------|---------|
| `git` | Worktree management |
| `fzf` | Interactive picker in `wt` |
| `tmux` | Session management in `code` |
| `pi` | pi coding agent — launched by `code` (installed locally via `npm install`) |
| `meridian` | Anthropic-compatible proxy for Claude Max — launched by `code` (installed locally via `npm install`) |
| `claude` | Claude Code CLI — used by `wt-name` for AI slug generation, and by `meridian` for Max auth (`claude login`) |
| `nc` | Port check — used by `code` to wait for meridian startup (pre-installed on macOS/Linux) |
| `gh` | GitHub CLI — used by `wt-name` for issue lookups |
| `jq` | JSON parsing in `wt-name` |
| `tuicr` | TUI code review in `code` |

## Install

Run the install script — it handles dependencies (using cargo where available) and symlinks the scripts:

```bash
git clone https://github.com/peterp/ade ~/gh/peterp/ade
~/gh/peterp/ade/install
```

Make sure `~/.local/bin` is on your `$PATH` (add to `~/.zshrc` or `~/.bashrc` if needed):

```bash
export PATH="$HOME/.local/bin:$PATH"
```
