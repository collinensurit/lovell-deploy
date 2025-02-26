#!/bin/bash

# Script to update imports in the codebase to use the new consolidated utilities

# Update cn utility imports
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/lib/utils/cn'\''|from '\''@/lib-new/utils'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/lib/utils'\''|from '\''@/lib-new/utils'\''|g'

# Update hook imports
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-context-menu'\''|from '\''@/hooks-new/use-context-menu'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-templates'\''|from '\''@/hooks-new/use-templates'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-toast'\''|from '\''@/hooks-new/use-toast'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-user'\''|from '\''@/hooks-new/use-user'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-panel-shortcuts'\''|from '\''@/hooks-new/use-panel-shortcuts'\''|g'
find /Users/collin/lovell-deploy/src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from '\''@/hooks/use-mobile'\''|from '\''@/hooks-new/use-mobile'\''|g'

echo "Import paths updated to use the new consolidated utilities and hooks"
