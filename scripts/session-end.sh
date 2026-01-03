#!/bin/bash
# M.E.G.A. Session End Script
# Run this at the end of each work session

echo "🔄 M.E.G.A. Session End Protocol"
echo "================================"

# 1. Create snapshot
echo "📸 Creating project snapshot..."
bash /c/mega-project-status/create-snapshot.sh

# 2. Update session log
SESSION_LOG="/c/mega-project-status/session-history.md"
echo "## Session End: $(date)" >> "$SESSION_LOG"
echo "- Project Phase: V4.1 Enhanced" >> "$SESSION_LOG"
echo "- Changes Made: $1" >> "$SESSION_LOG"
echo "- Next Steps: $2" >> "$SESSION_LOG"
echo "" >> "$SESSION_LOG"

# 3. Create next session TODO
cat > "/c/mega-project-status/next-session-todo.md" << 'TODO'
# Next Session TODO - $(date)

## Priority 1 (Critical)
- [ ] Verify localhost:8000 loads
- [ ] Check data pipeline: node scripts/fetch-money-trail.js
- [ ] Test production build: npm run build

## Priority 2 (Features)
- [ ] Start Phase 3.2: Congress.gov API integration
- [ ] Add committee type visualizations
- [ ] Enhance party detection from committee data

## Priority 3 (Polish)
- [ ] Fix any remaining console warnings
- [ ] Update README with current status
- [ ] Test Vercel deployment

## Session Context
Last session ended with working V4.1 enhanced schema.
Committee metadata is preserved, UI shows real data.
TODO

echo ""
echo "✅ Session documented"
echo "📋 Next session TODO: /c/mega-project-status/next-session-todo.md"
echo "🚀 Next time run: /c/mega-project-status/current/QUICK_START.sh"
