import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Axios from "../axios";
import ENDPOINTS from "../endpoints";
import AddForwardCatMenu from "./components/AddForwardCatMenu";
import { userContext } from "../App";
import { ZonedDateTime } from "@js-joda/core";
import AddDutchCatMenu from "./components/AddDutchCatMenu";

export const CatMenu = () => {
  const headers = [
    "Item ID",
    "Status",
    "Name",
    "Current Price",
    "Auction Type",
    "Highest Bidder",
    "End Time",
    "Shipping Time",
    "Select",
  ];

  const dutchHeaders = [
    "Item ID",
    "Status",
    "Name",
    "Current Price",
    "Decrement Price",
    "Base Price",
    "Auction Type",
    "End Time",
    "Shipping Time",
    "Select",
  ];

  const [forwardData, setForwardData] = useState([]);

  const [dutchData, setDutchData] = useState([]);

  const [refresh, toggleRefresh] = useState(false);

  const { user, setUser, auction, setAuction, showBidDashboard } =
    useContext(userContext);

  const [selected, setSelected] = useState("");

  const refreshCatalogueItems = () => {
    Axios.get(ENDPOINTS.CATALOGUE.GETALLITEMS)
      .then((res) => {
        setForwardData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refreshDutchItems = () => {
    Axios.get(ENDPOINTS.DUTCHITEM.GETALLITEMS)
      .then((res) => {
        setDutchData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    refreshCatalogueItems();
    refreshDutchItems();
  }, []);

  useEffect(() => {
    refreshCatalogueItems();
    refreshDutchItems();
  }, [refresh]);

  useEffect(() => {
    // console.log(forwardData);
  }, [forwardData]);

  const handleSubmission = () => {
    // console.log(JSON.parse(selected));
    setAuction(JSON.parse(selected));
    showBidDashboard();
  };

  return (
    <div>
      <h1>Catalogue</h1>
      <br></br>

      <Form>
        <div>
          <h1>Forwards Auctions</h1>
          <AddForwardCatMenu refresh={refresh} toggleRefresh={toggleRefresh} />
          <Table striped>
            <thead>
              <tr>
                {headers.map((header) => {
                  return <th>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {forwardData.map((row, i) => {
                const status = ZonedDateTime.now().isBefore(
                  ZonedDateTime.parse(row.endTime)
                );

                return (
                  <tr>
                    <th>{row.itemID}</th>
                    <th>{status ? "Active" : "Ended"}</th>
                    <th>{row.name}</th>
                    <th>{row.currentPrice}</th>
                    <th>{row.auctionType}</th>
                    <th>{row.highestBidderID}</th>
                    <th>{row.endTime}</th>
                    <th>{row.shippingTime}</th>
                    <th>
                      <Form.Check
                        type={"radio"}
                        name="group1"
                        label={i}
                        value={JSON.stringify(row)}
                        onClick={(e) => {
                          // console.log(e.target.value);
                          setSelected(e.target.value);
                        }}
                      />
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div>
          <h1>Dutch Auctions</h1>
          <AddDutchCatMenu refresh={refresh} toggleRefresh={toggleRefresh} />
          <Table striped>
            <thead>
              <tr>
                {dutchHeaders.map((header) => {
                  return <th>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {dutchData !== undefined &&
                dutchData.map((row, i) => {
                  const status = ZonedDateTime.now().isBefore(
                    ZonedDateTime.parse(row.endTime)
                  );

                  return (
                    <tr>
                      <th>{row.itemID}</th>
                      <th>
                        {status && row.available === true ? "Active" : "Ended"}
                      </th>
                      <th>{row.name}</th>
                      <th>{row.price}</th>
                      <th>{row.decrementStep}</th>
                      <th>{row.lowestPrice}</th>
                      <th>{row.auctionType}</th>
                      <th>{row.endTime}</th>
                      <th>{row.shippingTime}</th>
                      <th>
                        <Form.Check
                          type={"radio"}
                          name="group1"
                          label={i}
                          value={JSON.stringify(row)}
                          onClick={(e) => {
                            // console.log(e.target.value);
                            setSelected(e.target.value);
                          }}
                        />
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <Button variant="primary" onClick={handleSubmission}>
          Select
        </Button>
      </Form>
    </div>
  );
};
