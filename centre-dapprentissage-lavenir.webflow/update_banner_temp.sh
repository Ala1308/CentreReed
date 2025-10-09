#!/bin/bash

# Files to update (detail and error pages)
FILES="detail_category.html detail_product.html 401.html 404.html"

for file in $FILES; do
  # Check if file has top-banner
  if ! grep -q "top-banner" "$file"; then
    # Add top-banner after <body> tag
    sed -i.bak '/<body/a\
  <!-- Top Banner - Firebase Dynamic Content -->\
  <div id="firebase-banner" class="top-banner"></div>' "$file"
  fi
done

echo "Updated banner divs in detail and error pages"
