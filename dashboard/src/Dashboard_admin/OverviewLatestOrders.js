import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState, useEffect } from "react";

import axios from "axios";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = () => {
  const [collector, setCollector] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/collectorlist")
      .then((res) => {
        setCollector(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [collector]);

  // window.location.reload(false);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <Card
      style={{
        marginLeft: "40px",
        marginRight: "20px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell style={{ fontWeight: "bolder" }}>Order</TableCell> */}
            <TableCell style={{ fontWeight: "bolder" }}>
              Collector Username
            </TableCell>
            <TableCell style={{ fontWeight: "bolder" }}>
              Collector Email
            </TableCell>
            <TableCell style={{ fontWeight: "bolder" }}>
              Approve/Reject
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {collector.map((order) => {
            // setEmail(order.email);
            return (
              <TableRow hover key={order.id}>
                <TableCell>{order.username}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  <button
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      axios
                        .post("http://localhost:8000/acceptcollector", {
                          email: order.email,
                        })
                        .then((res) => {
                          console.log(res.data);
                          alert("Collector Approved");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <CheckIcon
                      style={{ marginRight: "15px", color: "darkgreen" }}
                    />
                  </button>

                  <button
                    onClick={async () => {
                      axios
                        .post("http://localhost:8000/rejectcollector", {
                          email: order.email,
                        })
                        .then((res) => {
                          console.log(res.data);
                          alert("Collector Rejected");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <ClearIcon style={{ color: "red" }} />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};
