---
title: "Contributing to the project"
weight: 55
description: "How to contribute to VasakOS development: report a bug, propose an improvement or send a pull request."
---

A guide to contributing to the development of **VasakOS**. This applies to in-house or
community work within the same environment.

## Contribution process

### Fork and clone

```bash
# On GitHub, fork the repository
# https://github.com/Vasak-OS/vasak-desktop

# Clone your fork
git clone https://github.com/YOUR_USER/vasak-desktop.git
cd vasak-desktop

# Add the original repository as a remote
git remote add upstream https://github.com/Vasak-OS/vasak-desktop.git
```

### Create a branch

```bash
# Update main from upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a branch for your feature
git checkout -b feature/short-description

# Or for a bugfix
git checkout -b bugfix/short-description

# Or for docs
git checkout -b docs/short-description
```

**Naming convention**:
- `feature/feature-name` - New functionality
- `bugfix/bug-name` - Bug fix
- `refactor/refactor-name` - Refactoring
- `docs/doc-name` - Documentation
- `chore/chore-name` - Tasks with no functional code

### Make your changes

Make the changes in the project however you see fit for what you are trying to solve. Remember
that you can use several commits if it helps you organise things, but avoid going overboard or
having commits that make no sense on their own. Gather everything you think matters for the PR
and for the documentation.

**Checklist**:
- [ ] The code follows the guidelines
- [ ] Tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Well-described commits

### Commits

```bash
# See the changes
git status

# Stage the changes
git add .

# Commit with a descriptive message
git commit -m "feat(audio): add volume normalization

Implement automatic volume normalization to provide
consistent output levels across different devices.

Closes #1234"
```

**Message format** (Conventional Commits):
```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Example**:
```
feat(audio): add volume normalization

Implement automatic volume normalization to provide
consistent output levels across different devices.
This prevents audio clipping and improves user
experience when switching between devices.

- Added VolumeNormalizer struct
- Integrated with audio pipeline
- Added unit tests

Closes #1234
Fixes #5678
```

### Push and pull request

```bash
# Push your branch
git push origin feature/short-description

# On GitHub, create a Pull Request
# Against: Vasak-OS/vasak-desktop main
# From: YOUR_USER/vasak-desktop feature/short-description
```

**PR template** (pre-filled):

```markdown
## Description
A brief description of what this PR does.

## Type of change
- [ ] New functionality
- [ ] Bug fix
- [ ] Change that breaks compatibility
- [ ] Documentation

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested on X11
- [ ] Tested on Wayland
- [ ] Unit tests pass
- [ ] Integration tests pass

## Checklist
- [ ] My code follows the guidelines
- [ ] I have self-reviewed
- [ ] I have commented complex code
- [ ] I have updated the documentation
- [ ] I have added tests
- [ ] The tests pass locally

## Benchmark (if applicable)
```

### Review and feedback

- Maintainers will review your PR
- Answer the comments
- Make changes if needed
- Request re-review once you have made changes

```bash
# After making changes
git add .
git commit -m "Address review feedback

- Changed X to Y
- Added comment for Z"

git push origin feature/short-description
```

### Merge

Once approved:
- Maintainers will merge your PR
- Your branch can be deleted

```bash
# Clean up locally
git checkout main
git branch -d feature/short-description
git pull upstream main
```

## Types of contribution

### New features

**Steps:**
1. Discuss it in an issue first
2. Follow the established architecture
3. Add tests
4. Document the change

### Bug fixes

**Steps:**
1. Open an issue describing the bug
2. Create a branch from the issue
3. Reproduce the bug with a test
4. Fix the bug
5. The test should pass
6. Document the fix

### Documentation

**Files:**
- `docs/user/*` - For end users | [repo](https://github.com/Vasak-OS/website)
- `docs/devs/*` - For developers | [repo](https://github.com/Vasak-OS/website)
- README.md - For the repository
- Code comments - Inside the code

### Performance improvements

**Requirements:**
1. Measure first (with a profiler)
2. Implement the improvement
3. Measure afterwards (compare)
4. Add a benchmark if it is critical
5. Document the change

### Tests

**Types:**
- Unit tests - Individual functions
- Integration tests - Integrated components
- E2E tests - The complete user flow

**Location:**
- `src-tauri/tests/` - Rust tests
- `src/tests/` - Vue tests

## Bug reports

See [How to report bugs](/en/docs/user/report-bugs/)

**Requires**:
- A clear description
- Steps to reproduce
- Expected vs actual behaviour
- Operating system and version
- Relevant logs

## Code review

### As a reviewer

Check:
- [ ] The code works
- [ ] It follows the guidelines
- [ ] It has tests
- [ ] It is documented
- [ ] It introduces no regressions
- [ ] Performance is acceptable

> Constructive comment:
>
> ❌ "This is wrong"
>
> ✅ "Consider using X instead of Y because..."
>

### As an author

- Answer all the comments
- Do not be defensive
- Make the changes if they are improvements
- Explain your reasoning if you disagree
- Thank people for the feedback

## Licence

Every contribution must be compatible with the project licence.

See `LICENSE` in the project root.

## Expected behaviour

### Code of conduct

We are committed to keeping a respectful environment:

- Be respectful towards other contributors
- Accept constructive criticism
- Focus on the code, not the person
- Respect privacy
- Report abuse

### If you see inappropriate behaviour

Contact the maintainers directly (privately).

## Recognition

- Contributors will be credited in CONTRIBUTORS.md
- Commits stay in the Git history
- Major releases may have a special changelog

## Help and support

### Questions about contributing

- Open a Discussion on GitHub
- Ask in the community chat (if there is one)

### Do not know where to start

Look for issues with these labels:
- `good-first-issue` - For new contributors
- `help-wanted` - Help wanted
- `documentation` - Documentation improvements

### You need help

- Mention maintainers with @
- Be specific about your question
- Share code/error output if relevant

## Changes we do not accept

❌ **We do not accept**:
- Code that breaks compatibility without a major version
- Changes that require proprietary libraries
- Code that has no tests
- Incomplete documentation
- Style changes with no functionality
- Huge commits with no description

✅ **We accept**:
- New features that are well tested
- Bug fixes
- Performance improvements with evidence
- Improved documentation
- Refactoring that improves maintainability
- Additional tests

## Maintenance

### If you are a maintainer

Responsibilities:
- Review PRs promptly
- Keep the code clean
- Update the documentation
- Moderate behaviour
- Plan releases

### Merging

```bash
# Before merging, check:
git checkout main
git pull origin main
git merge --no-ff feature/branch -m "Merge feature/branch"

# Resolve conflicts if there are any

git push origin main

# Delete the branch
git push origin --delete feature/branch
```

## Releases

Versioning: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes
- `MINOR` - New features
- `PATCH` - Bug fixes

## Next steps

1. Pick an issue or feature
2. Comment that you will be working on it
3. Follow this contribution process
4. Thanks for contributing!

## Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## Frequently asked questions

**Q: Can I work on several things at the same time?**
A: Use a different branch for each thing.

**Q: How long does it take to review my PR?**
A: It depends, typically 1-3 days.

**Q: What if my PR is rejected?**
A: The reasons will be explained. You can ask for clarification.

**Q: Can I commit directly?**
A: No, everything goes through a PR (maintainers included).

**Q: Where do I see my contributions?**
A: On your GitHub profile and in `git log`.

---

Thanks for considering contributing to Vasak Desktop! 🎉
