# React modal manager

[react-modal-manager](https://github.com/Yusuf007R/react-modal-maneger) is a tiny 2kb library that helps you manage your react modals from everywhere in your app. Yes even outside components.🔥 it also allow you to get values from inside the modal with a promise system.🥵
It all super simple and easy to use.

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


Now you can just pass a component and it will be rendered. You can do it in any place in your app. Even outside components

```tsx
const result = modalManager.show(ConfirmationModal, {title:"are you sure?"});
```

From inside the modal you can access the `ModalAPI`
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

## Modal Lifecycle

### Showing
When you register a modal they will not even be mounted until you call `show` on them. In that moment they will be mounted and also the `isVisible` property will be set to `true`

### hidding
When you call `hide` the modal will be hidden and the `isVisible` property will be set to `false`, but it will not be unmounted.


### unMounting
If you want to completely unMount a modal you can call `unMount` function. Keep in mind that this will make the modal to instantly disappear so if you have a exit animation it will not be shown.



## Enter/Exit Animations

As said before If you unMount you modal without hiding it first it will not show the exit animation.
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

### Bad
```tsx
const ModalWithTransition = ({ title }: { title: string }) => {
  const options = useModal();
  return (
   {options.isVisible ?? (
     <Modal>
      {title}
    </Modal>
   )}
  );
}
```
### Good

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
MIT