import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './index.css';

class AddressForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {
                name: '',
                line1: '',
                line2: '',
                city: '',
                state: '',
                zip: '',
                phone: ''
            },
            errors: {
                name: '',
                line1: '',
                city: '',
                state: '',
                zip: '',
                phone: ''
            },
            buttonText: 'Add'
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.props.EditCallback((address) => {
            this.setState({
                address: address,
                buttonText: 'Edit'
            });
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        const addr = JSON.parse(JSON.stringify(this.state.address));
        addr[name] = value;

        this.setState({ address: addr });
    }

    validate() {
        let isError = false;
        const errors = {
            name: '',
            isNameError: false,
            line1: '',
            isLine1Error: false,
            city: '',
            isCityError: false,
            state: '',
            isStateError: false,
            zip: '',
            isZipError: false,
            phone: '',
            isPhoneError: false
        };

        if (this.state.address.name.trim() === "") {
            isError = true;
            errors.name = 'Required';
            errors.isNameError = true;
        }

        if (this.state.address.line1.trim() === "") {
            isError = true;
            errors.line1 = 'Required';
            errors.isLine1Error = true;
        }

        if (this.state.address.city.trim() === "") {
            isError = true;
            errors.city = 'Required';
            errors.isCityError = true;
        }

        if (this.state.address.state.trim() === "") {
            isError = true;
            errors.state = 'Required';
            errors.isStateError = true;
        }
        else if (!/^[A-Z]{2}$/.test(this.state.address.state)) {
            isError = true;
            errors.state = 'Please enter a valid two digit state code.';
            errors.isStateError = true;
        }

        if (this.state.address.zip.trim() === "") {
            isError = true;
            errors.zip = 'Required';
            errors.isZipError = true;
        }
        else if (!/\d{5}(-\d{4})?/.test(this.state.address.zip)) {
            isError = true;
            errors.zip = 'Please enter a valid zip code.';
            errors.isZipError = true;
        }

        if (this.state.address.phone.trim() === "") {
            isError = true;
            errors.phone = 'Required';
            errors.isPhoneError = true;
        }
        else if (!/\d{3}-?\d{3}-?\d{4}/.test(this.state.address.phone))
        {
            isError = true;
            errors.phone = 'Please enter a valid phone number'
            errors.isPhoneError = true;
        }


        this.setState({ errors: errors });

        return isError;
    }

    handleSubmit(event) {
        event.preventDefault();

        const err = this.validate();
        if (!err) {
            this.props.Save(this.state.address);
            this.setState({
                address: {
                    name: '',
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: ''
                },
                buttonText: 'Add'
            });
        }
    }

    render() {
        const addr = this.state.address;
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField name='name'
                    label='Contact Name*'
                    value={addr.name}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.name}
                    error={this.state.errors.isNameError}
                />
                <div><TextField name='line1'
                    label='Street Address 1*'
                    value={addr.line1}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.line1}
                    error={this.state.errors.isLine1Error}
                /></div>
                <div><TextField name='line2'
                    label='Street Address 2'
                    value={addr.line2}
                    onChange={this.handleInputChange}
                /></div>
                <div><TextField name='city'
                    label='City*'
                    value={addr.city}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.city}
                    error={this.state.errors.isCityError}
                /></div>
                <div><TextField name='state'
                    label='State*'
                    value={addr.state}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.state}
                    error={this.state.errors.isStateError}
                /></div>
                <div><TextField name='zip'
                    label='Zip Code*'
                    value={addr.zip}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.zip}
                    error={this.state.errors.isZipError}
                /></div>
                <div><TextField name='phone'
                    label='Phone*'
                    value={addr.phone}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.phone}
                    error={this.state.errors.isPhoneError}
                /></div>
                <Button type='submit' variant='outlined'>{this.state.buttonText}</Button>
            </form>
        );
    }
}

class AddressBook extends React.Component {
    renderAddress(address) {
        return (
            <li key={address}>
                <div className='name'>{address.name}
                    <Button variant='text' onClick={() => this.props.onEdit(address)}>Edit</Button>
                    <Button variant='text' onClick={() => this.props.onDelete(address)}>Delete</Button>
                </div>
                
                <div className='addrline'>{address.line1}</div>
                <div className='addrline'>{address.line2}</div>
                <div className='addrline'>{address.city} {address.state} {address.zip}</div>
                <div className='addrline'>{address.phone}</div>
                
            </li>
        )
    }

    render() {
        return (
            <ul>
                {Object.getOwnPropertyNames(this.props.addresses).map((key) => this.renderAddress(this.props.addresses[key]))}
            </ul>
        )
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        const address = {};
        address[1] = { id: 1, name: 'Eric Steuart', line1: '123 Main St', line2: 'Apt 23', city: 'SLC', state: 'UT', zip: '84110', phone: '801-555-1212' };

        this.state = {
            addresses: address,
            nextId: 2,
            startEdit: (address) => { return; }
        };
    }

    onSave(address) {
        const a = Object.assign({}, address);
        if (a.id === undefined) {
            a.id = this.state.nextId;
            this.setState({ nextId: this.state.nextId + 1 });
        }

        const addresses = JSON.parse(JSON.stringify(this.state.addresses));
        addresses[a.id] = a;
        this.setState({ addresses: addresses });
    }

    onEdit(address) {
        this.state.startEdit(address);
    }

    editCallback(callback) {
        this.setState({ startEdit: callback });
    }

    onDelete(address) {
        const addresses = JSON.parse(JSON.stringify(this.state.addresses));
        delete addresses[address.id];
        this.setState({ addresses: addresses });
    }

    render() {
        return (
            <div>
                <AddressForm Save={(address) => this.onSave(address)} EditCallback={(callback) => this.editCallback(callback)} />
                <hr></hr>
                <AddressBook addresses={this.state.addresses} onEdit={(address, callback) => this.onEdit(address)} onDelete={(address)=>this.onDelete(address)} />
            </div>
        );
    }
}

ReactDOM.render(
    <Controller />,
    document.getElementById('root')
);
