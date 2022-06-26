# React Modal Manager

[react-modal-manager](https://github.com/Yusuf007R/react-modal-maneger) is a tiny 2kb library that helps you manage your react modals from everywhere in your app. Yes even outside components.🔥 it also allow you to get values from inside the modal with a promise system.🥵
It all super simple and easy to use.

> Keep in mind that this a Modal Manager. Not a Modal UI component or something like that. You have to provide your own modal UI component.

# Getting started


## Install


```bash
yarn add @yusuf007r/react-modal-manager # or npm install @yusuf007r/react-modal-manager
```

## Usage
You first have to import and initialize the modal manager.

```tsx
import { ModalManager, ModalProvider } from '@yusuf007r/react-modal-manager';

const modalManager = new ModalManager();

const App = () => {
  return (
    <ModalProvider modalManager={modalManager}>
     //...
    </ModalProvider>
  )
}
```


Now you can just pass a `component` and it will be rendered. You can do it in any place in your app. Even outside components

```tsx
const result = modalManager.show(ConfirmationModal, {title:"are you sure?"});
```

From inside the modal you can access the `ModalAPI`
> for this examples we will use [react-modal](https://github.com/reactjs/react-modal).
```tsx
import Modal from 'react-modal';

const ConfirmationModal = ({ title }: { title: string }) => {
  const options = useModal();
  const resolve = (value: boolean) => {
    options.hide();
    options.resolve(value);
  };
  return (
    <Modal
      onRequestClose={options.hide}
      isOpen={options.isVisible}
    >
      {title}
      <button onClick={() => resolve(true)}>Confirm</button>
      <button onClick={() => resolve(false)}>Reject</button>
    </Modal>
  );
}
```
## Registering Modals
You can also register modals at the moment of initialization and use them by key later. This is actually the reason this library was created. I wanted to be able to register modals that I know I will use a lot.

```tsx
const modalManager = new ModalManager({
  'confirmation-modal': ConfirmationModal,
});

// the key and the props will be autocompleted by typescript
const result = await modalManager.show('confirmation-modal', {
  title: 'Are you sure?',
});
```
## ModalAPI
is a simple object that has the following properties:

```tsx
const Modal = () => {
  const {
    isVisible, // a boolean that indicates if the modal is visible.
    hide, // a function that hides the modal.
    unMount, // a function that unmounts the modal.
    resolve, // a function that resolves the promise with a given value.
    reject, // a function that rejects the promise with a given value.
  } = useModal();
  
  return (
  //...
  );
}
```

## Controlling modals
As said before you can control your modals from everywhere in your app. All the available methods for a modals are available in the `ModalManager`.

### Showing modals
It receives a `component` or the key of a `registered` modal, the second argument is the props that will be passed to the modal. The type of the props will be inferred from the modal component. It returns a promise that can be resolved or rejected. Usually from inside de modal.
```tsx
modalManager.show('confirmation-modal', {title:"are you sure?"});
```
### Hiding modals
It receives the key of the modal you want to hide. Keep in mind that if it is a `registered` modal it  will not be unmounted. it will only be hidden (the `isVisible` property will be set to `false`).

`components` modals will be automatically unmounted.
> This will be used from inside the modal using the `useModal` hook.

```tsx
modalManager.hide('confirmation-modal');
```
### unMounting modals
it receives the key of the modal you want to unmount. 
> This will be used from inside the modal using the `useModal` hook.
```tsx 
modalManager.unMount('confirmation-modal');
```

### Resolving promises
you can access the `PromiseAPI` from the `useModal` hook or from the `getPromise` method of `ModalManager`
```tsx
const {promise, resolve, reject } = modalManager.getPromiseAPI('confirmation-modal');

//resolve the promise with a value
resolve(true);

//reject the promise with a value
reject(false);
```
## Enter/Exit Animations

If you unMount you modal without hiding it first it will not show the exit animation. it will just unmount, just disappear.
Similar concept applies to showing a modal and the enter animation.
Keep that if you modal does not have animation any of this applies to you.


### Exit Animation
first when closing the you have to call the hide function. 
this will hide the modal and show the exit animation.
then in the afterClose event you can safely unmount the modal. 
```tsx
import Modal from 'react-modal';

// this example is using the react-modal library. But usually its very similar with any other library.
const ModalWithTransition = ({ title }: { title: string }) => {
  const options = useModal();
  return (
    <Modal
      onRequestClose={options.hide}
      onAfterClose={options.unMount}
      closeTimeoutMS={500}
      isOpen={options.isVisible}
    >
      {title}
    </Modal>
  );
}
```
### Enter Animation

For the enter animation to be shown you have to pass the `isVisible` value to the modal. You should not conditionally render the modal. because if you do it will not show the enter animation.

### Bad 👿
```tsx
const ModalWithTransition = ({ title }: { title: string }) => {
  const options = useModal();
  return (
   {options.isVisible && (
     <Modal>
      {title}
    </Modal>
   )}
  );
}
```
### Good 😈

```tsx
const ModalWithTransition = ({ title }: { title: string }) => {
  const options = useModal();
  return (
    <Modal isOpen={options.isVisible}>
      {title}
    </Modal>
  );
}
```




# License
[MIT](https://github.com/Yusuf007R/react-modal-maneger/blob/main/LICENSE)