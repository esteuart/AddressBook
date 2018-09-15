import React from 'react';
import ReactDOM from 'react-dom';
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

    handleSubmit(event) {
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

        event.preventDefault();
    }

    render() {
        const addr = this.state.address;
        return (
            <form onSubmit={this.handleSubmit}>
                <div>Name: <input type='text' name='name' value={addr.name} onChange={this.handleInputChange}></input></div>
                <div>Address</div>
                <div>Line 1: <input type='text' name='line1' value={addr.line1} onChange={this.handleInputChange}></input></div>
                <div>Line 2: <input type='text' name='line2' value={addr.line2} onChange={this.handleInputChange}></input></div>
                <div>City: <input type='text' name='city' value={addr.city} onChange={this.handleInputChange}></input></div>
                <div>State: <input type='text' name='state' value={addr.state} onChange={this.handleInputChange}></input></div>
                <div>Zip Code: <input type='text' name='zip' value={addr.zip} onChange={this.handleInputChange}></input></div>
                <div>Phone: <input type='text' name='phone' value={addr.phone} onChange={this.handleInputChange}></input></div>
                <input type='submit' value={this.state.buttonText} className='add'></input>
            </form>
        );
    }
}

class AddressBook extends React.Component {
    renderAddress(address) {
        return (
            <li key={address}>
                <div className='name'>{address.name}</div>
                <div className='address'>Address: </div>
                <div className='addrline'>{address.line1}</div>
                <div className='addrline'>{address.line2}</div>
                <div className='addrline'>{address.city} {address.state} {address.zip}</div>
                <div className='phone'>Phone: {address.phone}</div>
                <button className='edit' onClick={() => this.props.onEdit(address)}>Edit</button>
                <button className='delete' onClick={() => this.props.onDelete(address)}>Delete</button>
            </li>
        )
    }

    render() {
        return (
            <ul>
                {Object.getOwnPropertyNames(this.props.addresses).map((key) => { return this.renderAddress(this.props.addresses[key]) })}
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
