import axios from "axios";
import Errors from "./Errors";

var http = axios.create( {
    headers: { "X-Requested-With": "XMLHttpRequest" }
} );

export default class Form {
    constructor( data ) {
        this.originalData = data;

        for ( let key in data ) {
            this[ key ] = data[ key ];
        }

        this.errors = new Errors();

        return this;
    }

    data() {
        let dataCopy = {};

        for ( let key in this.originalData ) {
            dataCopy[ key ] = this[ key ];
        }

        return dataCopy;
    }

    post( url ) {
        this.submit( "post", url );
    }

    put( url ) {
        this.submit( "put", url );   
    }

    patch( url ) {
        this.submit( "patch", url );   
    }

    delete( url ) {
        this.submit( "delete", url );   
    }

    submit( requestType, url ) {
        const method = requestType.toLowerCase();
        const data = this.data();

        return new Promise( ( resolve, reject ) => {
            http.request( { method, url, data } )
                .then( ( { data } ) => {
                    this.onSuccess( data );
                    resolve( data );
                } )
                .catch( ( { response } ) => {
                    if ( response.status === 422 ) {
                        this.onError( response.data );
                    }
                    reject( response );
                } );
        } );
    }

    onSuccess( data ) {
        this.reset();
    }

    onError( errors ) {
        this.errors.record( errors );
    }

    reset() {
        for ( let key in this.originalData ) {
            this[ key ] = this.originalData[ key ];
        }

        this.errors.clear();
    }
}