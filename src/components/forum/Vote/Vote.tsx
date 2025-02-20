import React, {FC} from 'react';
import classes from './Vote.module.css'
import {ConfigProvider, Flex, Radio, RadioChangeEvent, Tooltip} from "antd";
import {IVote} from "../../../API/services/forum/VoteService";
import {useAuth0} from "@auth0/auth0-react";

interface VoteProps {
    vote: IVote
    onChange: (e: RadioChangeEvent) => void
    value: string
}

const Vote: FC<VoteProps> = ({vote, onChange, value}) => {

    const {isAuthenticated} = useAuth0()

    return (
        <Flex vertical
              gap={5}
              className={classes.voteWrapper}
        >
            <span className={classes.title}>Опитування</span>
            <span className={classes.voteText}>{vote.text}</span>

            <ConfigProvider theme={{
                token: {
                    colorPrimary: '#98123F',
                },
            }}>
                <Radio.Group onChange={onChange} value={value}>
                    <Flex className={classes.options} vertical>

                        {vote.options.map((option) =>
                            <Tooltip title={isAuthenticated ? "" : "Ввійдіть щоб зробити дію"} placement={'topLeft'}>
                                <Radio disabled={!isAuthenticated} value={option} style={{color: "white", fontSize: 16}}>{option}</Radio>

                            </Tooltip>
                        )}
                    </Flex>
                </Radio.Group>
            </ConfigProvider>
        </Flex>
    );
};

export default Vote;
