Some emergency styles for [react-hook-form-auto](https://github.com/dgonz64/react-hook-form-auto)

## Installation

    $ npm install rhfa-emergency-styles --save

## Usage

### With `sass` and `css-modules`

```javascript
    import styles from 'rhfa-emergency-styles/unprefixed.sass'

    <Autoform styles={styles} />
```

### Without `sass` but with `css-modules`

```javascript
    import styles from 'rhfa-emergency-styles/dist/unprefixed.css'

    <Autoform styles={styles} />
```

### Without `css-modules`

```javascript
    import styles from 'rhfa-emergency-styles'

    // With sass...
    import 'rhfa-emergency-styles/prefixed.sass'
    // ...or without
    import 'rhfa-emergency-styles/dist/styles.css'

    <Autoform styles={styles} />
```

