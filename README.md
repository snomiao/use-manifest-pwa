## README.md

# use-manifest-pwa

A React hook for managing Progressive Web App (PWA) manifests. This is a work-in-progress library, designed to simplify the integration and manipulation of web app manifests in your React applications.

## Features

- **React Hook**: Easy-to-use hook for managing PWA manifests.
- **TypeScript Support**: Fully typed with TypeScript definitions included.
- **Modern JS**: Uses the latest JavaScript features, including ESNext syntax.

## Installation

```sh
npm install use-manifest-pwa
```

Or, if you're using Yarn:

```sh
yarn add use-manifest-pwa
```

## Usage

### Basic usage

Import and use the `useManifest` hook within your React components:

```jsx
import React from 'react';
import { useManifest } from 'use-manifest-pwa';

const App = () => {
  const manifest = useManifest({
    name: "My PWA",
    short_name: "PWA",
    start_url: ".",
    display: "standalone"
  });

  return (
    <div>
      <h1>Hello, PWA!</h1>
    </div>
  );
};

export default App;
```

### Custom Configuration

You can customize your manifest by passing different configurations to the `useManifest` hook. The following example sets up a manifest with a custom theme and icons:

```jsx
import React from 'react';
import { useManifest } from 'use-manifest-pwa';

const App = () => {
  const manifest = useManifest({
    name: "Custom PWA",
    short_name: "C-PWA",
    start_url: "/home",
    display: "fullscreen",
    theme_color: "#ffffff",
    icons: [
      {
        src: "path/to/icon.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "path/to/icon-large.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  });

  return (
    <div>
      <h1>Welcome to Custom PWA!</h1>
    </div>
  );
};

export default App;
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/snomiao/use-manifest-pwa/tags). 

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Thanks to all the contributors who helped to make this project better.

---

*Created by [snomiao](mailto:snomiao@gmail.com)*
