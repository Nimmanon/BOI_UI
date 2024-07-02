import React from 'react';

const Summary = ({ data, column }) => {
    return (
        <div>
            <div className="card p-4 pm-5">
                <div className="overflow-x-auto">
                    <table className="table table-auto table_striped w-full">
                        <thead>
                            <tr>
                                {column.map((item, index) => <TableHeadItem key={index} item={item} />)}
                            </tr>
                        </thead>
                        <tbody>
                            {/* {
                                dataList.map((item, index) =>
                                    <TableRow
                                        eventClick={actionClick}
                                        eventCheckClick={checkClick}
                                        subTable={subTable}
                                        key={index}
                                        item={item}
                                        column={column}
                                    />
                                )
                            } */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const TableHeadItem = ({ item }) => {

    return (
        <th
            style={{ "textAlign": item.align, "cursor": "pointer" }} className="uppercase">
            {
                item.total ? item.label : ' '
            }
        </th>
    );
}

export default Summary;
