# ade — agentic dev environment

Personal scripts for running pi coding agents in git worktrees with tmux.

## Scripts

### `wt` — worktree switcher

Navigate between git worktrees with fuzzy matching and an fzf picker.

```
wt                        # interactive fzf picker
wt <name>                 # switch to worktree matching name/branch (fuzzy)
wt add <url>              # create a new worktree from a GitHub issue URL or description
wt add -r <branch>        # use branch name as-is, skip AI name generation
wt add -b <base> <input>  # base the new branch off <base> instead of current HEAD
wt exit                   # switch back to the main worktree
```

`wt add` calls `wt-name` to generate the branch slug via Claude, then creates the worktree and switches to it. Inside tmux it sends `cd` to the current window; outside tmux it `exec`s a new shell in the target directory. Pass `-r` / `--raw` to skip name generation and use your input directly as the branch name. Pass `-b` / `--base` to branch off a specific ref (e.g. `wt add -b main "fix login bug"`); ignored when the branch already exists. Flags can be combined (e.g. `wt add -r -b main my-branch`).

### `wt-name` — AI branch name generator

Generates a `pp-<verb>-<slug>` branch name from a description or GitHub issue URL.

```
wt-name "add dark mode support"
wt-name https://github.com/owner/repo/issues/123
echo "fix login bug" | wt-name
```

For GitHub issue URLs, fetches the title, labels, and body via `gh` to produce a more accurate slug. Uses `claude-haiku` to generate the slug.

### `code` — start a pi session

Launches (or relaunches) a named tmux session for the current worktree with three windows:

| Window | Name | Contents |
|--------|------|----------|
| 1 | `agent` | `pi` via the local `pi` wrapper — auto-starts meridian in the background and loads the meridian extension |
| 2 | `review` | `tuicr` (TUI code review) |
| 3 | `terminal` | Plain shell |

Meridian is managed by the `pi` wrapper (see below), so there's no separate proxy window — if it's already running on the port, the wrapper reuses it.

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
| `meridian` | Anthropic-compatible proxy for Claude Max — auto-started by the `pi` wrapper (installed locally via `npm install`) |
| `nc` | Port check — used by the `pi` wrapper to detect/wait for meridian (pre-installed on macOS/Linux) |
| `claude` | Claude Code CLI — used by `wt-name` for AI slug generation, and by `meridian` for Max auth (`claude login`) |
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
