import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

class AddQualification extends Component {
  constructor(props) {
    super(props);
    var get_id = localStorage.getItem("edit_id");

    this.state = {
      button_status: "false",
      id: get_id,
      rows: []
    };
  }

  add_qualification = () => {
    const item = {
      qualification_name: "",
      year: ""
    };
    this.setState({
      rows: [...this.state.rows, item],
      button_status: "true"
    });
  };

  componentDidUpdate(prevState) {}

  remove_qualification = () => {
    const qualify_details = [...this.state.rows];
    const new_data = qualify_details.slice(0, -1);
    this.setState({
      rows: new_data
    });
  };

  remove_qualification_specific = id => {
    const row = [...this.state.rows];

    const rows = row.filter((item, j) => j !== id);
    this.setState(
      {
        rows
      },
      () => {
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            let formData = new FormData(); //formdata object
            formData.append("rows", this.state);
            axios
              .put(
                `http://localhost:5000/save_qualification/` + this.state.id,
                this.state
              )
              .then(res => {
                if (res.msg !== "" || res.msg !== null) {
                  ToastsStore.error("Qualification already exist");
                  this.setState({
                    rows: []
                  });
                } else {
                  ToastsStore.success("Qualification add successfully");
                  this.setState({
                    rows: []
                  });
                }
              });
          }
        },
        {
          label: "No"
        }
      ]
    });
  };
  handleChange = (i, e) => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[i][name] = value;
    this.setState(
      {
        rows
      },
      () => {
        for (let i = 0; i < this.state.rows.length; i++) {
          if (
            this.state.rows[i].qualification_name === "" ||
            this.state.rows[i].year === ""
          ) {
            this.setState({
              button_status: "true"
            });
            break;
          } else if (
            this.state.rows[i].qualification_name !== "" ||
            this.state.rows[i].year !== ""
          ) {
            this.setState({
              button_status: "false"
            });
          }
        }
      }
    );
    // this.setState((prevState) => ({...prevState,rows: rows}
    //     ))
  };
  render() {
    return (
      <div className="row">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{JSON.stringify(this.state)}
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center"> #</th>
              <th className="text-center"> Qualification Name </th>
              <th className="text-center"> Year </th>
              <th className="text-center"> Remove </th>
            </tr>
          </thead>
          <tbody>
            {this.state.rows.length &&
              this.state.rows.map((itme, i) => (
                <tr key={i}>
                  <td className="text-center">{i}</td>
                  <td className="text-center">
                    <input
                      type="text"
                      value={itme.qualification_name}
                      name="qualification_name"
                      onChange={e => this.handleChange(i, e)}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="text"
                      value={itme.year}
                      name="year"
                      onChange={e => this.handleChange(i, e)}
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="btn-floating btn-large waves-effect waves-light red float-right"
                      onClick={() => this.remove_qualification_specific(i)}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            {/* || this.state.button_status=="true" */}
            <button
              type="button"
              disabled={
                this.state.rows.length === 0 ||
                this.state.button_status === "true"
              }
              onClick={this.handleSubmit}
              className="btn-floating btn-large waves-effect waves-light red float-right"
            >
              Save
            </button>
            <button
              className="btn-floating btn-large waves-effect waves-light blue"
              onClick={this.add_qualification}
            >
              Add qualification
            </button>
            <button
              disabled={this.state.rows.length === 0}
              className="btn-floating btn-large waves-effect waves-light red float-right"
              onClick={this.remove_qualification}
            >
              Minus
            </button>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default AddQualification;
