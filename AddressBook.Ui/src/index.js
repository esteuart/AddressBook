import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './index.css';

window.dataUrl = 'http://localhost:52144/api/Address';

class AddressForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {
                Name: '',
                Line1: '',
                Line2: '',
                City: '',
                State: '',
                Zip: '',
                Phone: ''
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

        if (this.state.address.Name.trim() === "") {
            isError = true;
            errors.name = 'Required';
            errors.isNameError = true;
        }

        if (this.state.address.Line1.trim() === "") {
            isError = true;
            errors.line1 = 'Required';
            errors.isLine1Error = true;
        }

        if (this.state.address.City.trim() === "") {
            isError = true;
            errors.city = 'Required';
            errors.isCityError = true;
        }

        if (this.state.address.State.trim() === "") {
            isError = true;
            errors.state = 'Required';
            errors.isStateError = true;
        }
        else if (!/^[A-Z]{2}$/.test(this.state.address.State)) {
            isError = true;
            errors.state = 'Please enter a valid two digit state code.';
            errors.isStateError = true;
        }

        if (this.state.address.Zip.trim() === "") {
            isError = true;
            errors.zip = 'Required';
            errors.isZipError = true;
        }
        else if (!/\d{5}(-\d{4})?/.test(this.state.address.Zip)) {
            isError = true;
            errors.zip = 'Please enter a valid zip code.';
            errors.isZipError = true;
        }

        if (this.state.address.Phone.trim() === "") {
            isError = true;
            errors.phone = 'Required';
            errors.isPhoneError = true;
        }
        else if (!/\d{3}-?\d{3}-?\d{4}/.test(this.state.address.Phone))
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
                    Name: '',
                    Line1: '',
                    Line2: '',
                    City: '',
                    State: '',
                    Zip: '',
                    Phone: ''
                },
                buttonText: 'Add'
            });
        }
    }

    render() {
        const addr = this.state.address;
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField name='Name'
                    label='Contact Name*'
                    value={addr.Name}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.name}
                    error={this.state.errors.isNameError}
                />
                <div><TextField name='Line1'
                    label='Street Address 1*'
                    value={addr.Line1}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.line1}
                    error={this.state.errors.isLine1Error}
                /></div>
                <div><TextField name='Line2'
                    label='Street Address 2'
                    value={addr.Line2}
                    onChange={this.handleInputChange}
                /></div>
                <div><TextField name='City'
                    label='City*'
                    value={addr.City}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.city}
                    error={this.state.errors.isCityError}
                /></div>
                <div><TextField name='State'
                    label='State*'
                    value={addr.State}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.state}
                    error={this.state.errors.isStateError}
                /></div>
                <div><TextField name='Zip'
                    label='Zip Code*'
                    value={addr.Zip}
                    onChange={this.handleInputChange}
                    helperText={this.state.errors.zip}
                    error={this.state.errors.isZipError}
                /></div>
                <div><TextField name='Phone'
                    label='Phone*'
                    value={addr.Phone}
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
            <li key={address.Id}>
                <div className='name'>{address.Name}
                    <Button variant='text' onClick={() => this.props.onEdit(address)}>Edit</Button>
                    <Button variant='text' onClick={() => this.props.onDelete(address)}>Delete</Button>
                </div>
                
                <div className='addrline'>{address.Line1}</div>
                <div className='addrline'>{address.Line2}</div>
                <div className='addrline'>{address.City} {address.State} {address.Zip}</div>
                <div className='addrline'>{address.Phone}</div>
                
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

        this.state = {
            addresses: {},
            nextId: 1,
            startEdit: (address) => { return; }
        };
    }

    componentDidMount() {
        fetch(window.dataUrl)
            .then((response) => response.json())
            .then((response) => {
                const addressArray = response;
                const addresses = {};
                let maxId = 1;

                addressArray.forEach((obj) => {
                    obj.Line2 = obj.Line2 || '';
                    addresses[obj.Id] = obj;
                    if (obj.Id > maxId) {
                        maxId = obj.Id + 1;
                    }
                });
                this.setState({
                    addresses: addresses,
                    nextId: maxId
                });
            }, (error) => alert('An error occurred: ' + error));
    }

    onSave(address) {
        const a = Object.assign({}, address); //copy the address object so setting the id doesn't alter the state of the address form.

        fetch(window.dataUrl, {
            method: "POST", headers: { "Content-type": "application/json; charset=UTF-8" }, body: JSON.stringify(a)
        }).then((response) => response.json())
          .then(
            (response) => {
                if (a.Id === undefined) {
                    a.Id = response.Id;
                }

                const addresses = JSON.parse(JSON.stringify(this.state.addresses)); //make a deep copy
                addresses[a.Id] = a;
                this.setState({ addresses: addresses });
            },
            (error) => alert('Push request caused an error: ' + error)
        );
    }

    onEdit(address) {
        this.state.startEdit(address);
    }

    editCallback(callback) {
        this.setState({ startEdit: callback });
    }

    onDelete(address) {
        fetch(window.dataUrl + '/' + address.Id, {
            method: "POST"
        }).then((response) => {
            if (response.ok) {
                const addresses = JSON.parse(JSON.stringify(this.state.addresses));
                delete addresses[address.Id];
                this.setState({ addresses: addresses });
            }
        });
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
