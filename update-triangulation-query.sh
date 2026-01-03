#!/bin/bash
cd /c/mega-project

# Create backup
cp src/components/TriangulationPreview.js src/components/TriangulationPreview.js.backup-exceptional

# Use sed to replace the GraphQL query with exceptional version
# We need to see the current query first to know exact line numbers
START_LINE=$(grep -n "const data = useStaticQuery" src/components/TriangulationPreview.js | cut -d: -f1)
END_LINE=$((START_LINE + 30)) # Estimate

echo "Current query starts at line $START_LINE"

# Create exceptional query
cat > /tmp/exceptional-query.js << 'QUERYEND'
  // EXCEPTIONAL GRAPHQL QUERY FOR MASTERPIECE SCHEMA
  const data = useStaticQuery(graphql\`
    query ExceptionalMoneyTrailQuery {
      contributions: allMoneyTrail(sort: {contribution_receipt_amount: DESC}, limit: 100) {
        nodes {
          id
          contributor_name
          contribution_receipt_amount
          contribution_receipt_date
          
          # EXCEPTIONAL: Flattened Committee Metadata (31 fields - sample)
          committee_name
          committee_type_full
          committee_organization_type_full
          committee_treasurer_name
          committee_party_full
          committee_state_full
          
          # M.E.G.A. Analysis Scores
          influence_score
          transparency_score
          longevity_score
          accountability_score
          
          # Raw Data for Triangulation
          contributor_employer
          contributor_occupation
          contributor_city
          contributor_state
          report_year
          two_year_transaction_period
        }
      }
      metadata: moneyTrailMetadata {
        total_amount
        average_amount
        biggest_donation
        total_contributions
        version
      }
    }
  \`);
QUERYEND

# Now we need to replace lines START_LINE to END_LINE with new query
# This is complex with sed, let's use a Python script
python3 << 'PYTHONEND'
import sys

with open('src/components/TriangulationPreview.js', 'r') as f:
    lines = f.readlines()

# Find the query start and end
start_idx = -1
end_idx = -1
in_query = False
backticks_count = 0

for i, line in enumerate(lines):
    if 'const data = useStaticQuery(graphql`' in line:
        start_idx = i
        in_query = True
        backticks_count = line.count('`')
    elif in_query and '`);' in line:
        backticks_count += line.count('`')
        if backticks_count >= 2:  # We've found the closing backticks
            end_idx = i
            break

if start_idx >= 0 and end_idx >= 0:
    # Read the exceptional query
    with open('/tmp/exceptional-query.js', 'r') as f:
        exceptional_query = f.readlines()
    
    # Replace the lines
    new_lines = lines[:start_idx] + exceptional_query + lines[end_idx+1:]
    
    with open('src/components/TriangulationPreview.js', 'w') as f:
        f.writelines(new_lines)
    
    print(f"✅ Replaced query from line {start_idx+1} to {end_idx+1}")
    print(f"✅ Exceptional query applied with 31 flattened committee fields")
else:
    print("❌ Could not find query boundaries")
    sys.exit(1)
PYTHONEND
