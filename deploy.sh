#!/bin/bash

# Check if file package.json exists, else, exit
if [ ! -f desktop.html ]; then
    echo "ERROR: desktop.html not found. You're not in the root folder."
    exit 1
fi

TARGETPATH="telefabi.ch/htmlDesktop"
EXCLUDES=(_tools .git .gitignore deploy.sh .DS_Store)
KEEPSTASH=false

usage() {
    echo "Usage:"
    echo "./deploy.sh           NPM build & deploy."
    echo "./deploy.sh -b        KEEP git stashes, NPM build, and deploy."
    exit 1
}

while getopts ":b" o; do
    case "${o}" in
        b)
            KEEPSTASH=true
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))  # ?

# COLORS
YELLOW='\033[0;33m'
BLACK='\033[0;30m'
WHITE='\033[0;97m'
GREEN='\033[0;32m'
ON_GREEN='\033[42m'
ON_RED='\033[41m'
NC='\033[0m'

# If changes where made, stash them all.
if [ "$KEEPSTASH" = false ]; then
    GITSTASHED=$(git diff-index --quiet HEAD -- || echo "untracked")
    if [ "$GITSTASHED" == "untracked" ]; then
        echo -e "\n${GREEN}Needs stashing.${NC}"
        git stash
    else
        echo -e "\n${YELLOW}Does not need stashing, commence.${NC}"
    fi
else
    echo -e "\n${WHITE}${ON_RED}!!! Keep unstaged changes !!!${NC} and deploy them to ${BLACK}${ON_GREEN}${TARGETPATH}${NC}."
fi

# Publish to github
git push --quiet &&

# Publish to server
# Copy specified dir recursively
# use port 2121 as per metanet. get IP from metanet gui. foldername of website.

# Start building the rsync command with options
RSYNC_CMD="rsync -avz"
# Dynamically add each exclusion to the command
for EXCLUDE in "${EXCLUDES[@]}"; do
    RSYNC_CMD+=" --exclude='$EXCLUDE'"
done
# Add the SSH command with the custom port
RSYNC_CMD+=" -e 'ssh -p 2121'"
# Specify source and destination
RSYNC_CMD+=" ./ filmkulissen@80.74.158.100:${TARGETPATH}"
# Execute the command
eval $RSYNC_CMD

echo -e "\n\n${GREEN}FINISHED${NC}\n${YELLOW}Built files${NC} uploaded to ${TARGETPATH}."

if [ "$GITSTASHED" == "untracked" ]; then
    # Reapply changes to local files
    git stash apply --quiet &&
    echo -e "\nCurrent local changes where git ${GREEN}stashed & reapplied${NC}."
elif [ "$KEEPSTASH" = true ]; then
    echo -e "\nLocal unstaged changes, if any, ${WHITE}${ON_RED}where deployd!${NC}"
else
    echo -e "\nNo local changes detected, ${GREEN}no git stashing${NC}."
fi

# NOTES

# login manually to server:
# ssh <username>@80.74.158.100 -p2121

# get authrized ssh keys /home/<username>/.ssh:
# https://download.asperasoft.com/download/docs/ascp/3.5.2/html/dita/creating_public_key_cmd.html

# Save ssh key in file /.ssh/authorized_keys on server 
# https://www.metanet.ch/support/713

# following copies only the specified file
#scp ./otherdir/myfile user@servername:/final/path/otherdir/