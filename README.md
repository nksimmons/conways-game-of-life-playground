# Life Lab

A small, browser-only Game of Life playground for curious minds. It includes
classic patterns, ten Life-like rules, bounded and wrap-around universes, and
a grid-view control. Zooming out creates more, smaller squares; zooming in
creates fewer, larger squares while keeping the pattern centered.

The rulebook lists every supported Life-like rule with its exact birth and
survival neighbour counts. Each rule card is also a control for choosing it.

The color controls change living cells, empty cells, and the space around the
grid. They stay in place when a different Life rule is selected.

There is no server, account, database, or API call. Everything happens in the
browser and disappears when the tab is closed.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file
server. No build step or dependency installation is required.

## Publish with GitHub Pages

The included GitHub Actions workflow deploys each push to `main`. In the
repository's GitHub Pages settings, choose **GitHub Actions** as the source,
then push this repository to GitHub. The workflow's deployment page will show
the public URL once it has completed.
