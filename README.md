# vue-form

Simple form class made to work well with Vue.js

## Installation

`yarn add oct-vue-form` or `npm install --save oct-vue-form`

## Usage

Bind an instance of `Form` on to your component's data:

```js
export default {
    data() {
        return {
            form: new Form()
        };
    }
};
```

Pass in an object of key / value pairs for the form fields and their initial values:

```js
new Form( {
    "name": "",
    "email": "",
    "age": ""
} )
```

Bind the form inputs using `v-model`:

```html
<input v-model="form.name" id="name" />
```

Submit the form using one of the helper methods (`post`, `put`, `patch`, or `delete`).  The request returns a promise:

```js
methods: {
    onSubmit() {
        this.form.post( "/my-endpoint" )
            .then( data => console.log( "yay!" ) )
            .catch( err => console.error( "fix them errors!" ) );
    }
}
```

The form will automatically try to convert a `422` response to errors under the `response.data` key.

## Example

```vue
<template>
    <form
        @submit.prevent="onSubmit"
        @keydown="form.errors.clear( $event.target.name )"
    >
        <div :class="[ 'form-group', form.errors.has( 'name' ) ? 'has-error' : '' ]">
            <label for="name" class="control-label">Name</label>
            <input v-model="form.name" id="name" class="form-control" />
            <span v-if="form.errors.has( 'name' )" class="help-block">
                {{ form.errors.get( "name" ) }}
            </span>
        </div>
        <div :class="[ 'form-group', form.errors.has( 'email' ) ? 'has-error' : '' ]">
            <label for="email" class="control-label">Email</label>
            <input v-model="form.email" id="email" class="form-control" />
            <span v-if="form.errors.has( 'email' )" class="help-block">
                {{ form.errors.get( "email" ) }}
            </span>
        </div>
        <div :class="[ 'form-group', form.errors.has( 'age' ) ? 'has-error' : '' ]">
            <label for="age" class="control-label">Age</label>
            <input v-model="form.age" id="age" class="form-control" />
            <span v-if="form.errors.has( 'age' )" class="help-block">
                {{ form.errors.get( "age" ) }}
            </span>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-primary">
                Submit
            </button>
        </div>
    </form>
</template>

<script>
import Vue from "vue";
import Form from "oct-vue-form";

export default {
    props: [ "method", "endpoint" ],
    data() {
        return {
            form: new Form( {
                name: "",
                email: "",
                age: ""
            } )
        };
    },
    methods: {
        onSubmit() {
            this.form.submit( this.method, this.endpoint )
                .then( console.log( "Finished!" ) )
                .catch( console.error( "Fix them errors!" ) );
        },

    }
};
</script>
```

## API

### Form

#### `data()`
Returns a copy of the data in the form.

#### `post( url )`
Submit a post request with the form data to the given url.

#### `put( url )`
Submit a put request with the form data to the given url.

#### `patch( url )`
Submit a patch request with the form data to the given url.

#### `delete( url )`
Submit a delete request with the form data to the given url.

#### `submit( requestType, url )`
Submit a request with the form data to the given url using the given request type.

#### `reset()`
Resets the current data to the original data passed in.

### Errors
Can be accessed under `form.errors`.
All instances of `field` can take a dot-delimited name (e.g. `my.nested.field`) including array indexes (e.g. `details.2.problem`).

#### `getAll()`
Returns all recorded errors.

#### `any()`
Returns true if there are any recorded errors.

#### `set( field, message )`
Sets the error message for the given field.  This method is mostly used internally after an ajax request.

#### `has( field )`
Returns true if the given field has an error message.

#### `get( field )`
Returns the error message for a given field.

#### `clear( field )`
Clears the error message for a given field.  If no field is passed, clears all the error messages.

#### `record( errors )`
Given an object of errors ( field -> message ), sets the errors accordingly.
