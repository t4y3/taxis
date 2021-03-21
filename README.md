# T:axis

[T:axis](https://t4y3.github.io/taxis/) - Make it easier to manage animations in requestAnimationFrame

## Document

### Constructor

#### Syntax

```typescript
new Taxis([, options]);
```

#### Parameters

##### `options`: `Optional`

- `timeline`  
  Can check your settings in your timeline.  
  Useful during development.  


  - `container`
    - Element to insert a Timeline
  - `debug`
    - A Boolean that, if true, indicates that the time axis can be edited in TImeline.
    
#### Example

```typescript
const taxis = new Taxis({
  timeline: {
    container: document.querySelector('#timeline')
    debug: true
  }
});
```

![timeline](https://user-images.githubusercontent.com/9010553/111482423-3c739d80-8777-11eb-9b0d-856dc357b38e.png)

## API

### add

#### Syntax

```typescript
taxis.add(key, duration, [, delay]);
taxis.add(key, duration, [, delay, position]);
```

#### Parameters

`key`
- Key indicating the time axis

`duration`
- Duration of the time axis

`delay`
- Amount of delay in milliseconds before the animation should begin.

`position`
- Controls the insertion point in the timeline (by default, it’s the end of the timeline).

#### Example

```typescript
const taxis = new Taxis();
taxis.add("key#01", 2000);
taxis.add("key#02", 1000, 500);
taxis.add("key#03", 300, 200, 'key#01');
```

### begin

#### Syntax

```typescript
taxis.begin();
```

### ticker

Called in the requestAnimationFrame.

#### Syntax

```typescript
taxis.ticker(callback);
```

#### Parameters

##### `callback`: Function

`time`
- Elapsed time since begin()

`axes`
- Map data of Taxis

#### Example

```typescript
const taxis = new Taxis();
taxis.add("key#01", 2000);
taxis.add("key#02", 600);
taxis.add("key#03", 4000);
taxis.ticker((time, axes) => {
  console.log(axes.get("key#01").progress); // 0.0 ~ 1.0
});
```
### Taxis

`progress`
- A number between 0.0 and 1.0 indicating the rate of progress

`enter`
- A Boolean that, if true, indicating that progress is greater than 0.0.

`pass`
- A Boolean that, if true, indicating that progress is equal to 1.0.