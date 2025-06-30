import React, { useState } from 'react';
import DockerLogo from '../../assets/Docker.png'
import DynamoDBLogo from '../../assets/DynamoDB.png'
import EC2Logo from '../../assets/EC2.png'
import GatewayLogo from '../../assets/Gateway.png'
import LambdaLogo from '../../assets/Lambda.png'
import MongoDBLogo from '../../assets/MongoDB.png'
import RedisLogo from '../../assets/Redis.png'
import S3Logo from '../../assets/S3.png'
import SESLogo from '../../assets/SES.png'
import SQSLogo from '../../assets/SQS.png'
import TextractLogo from '../../assets/Textract.png'
import TypesenseLogo from '../../assets/Typesense.png'
import './Footer.css';

export default function Footer() {
    
  return (
    <div className='footer-container'>
        <div className="techstack-container">
            <p className="techstack-p">Techstack</p>
            <div className="techstack-grid">
                <div className="techstack-item">
                    <img src={LambdaLogo} alt="AWS Lambda" className="techstack-img" />
                    <h3 className="techstack-h3">AWS Lambda</h3>
                </div>
                <div className="techstack-item">
                    <img src={DynamoDBLogo} alt="AWS DynamoDB" className="techstack-img" />
                    <h3 className="techstack-h3">AWS DynamoDB</h3>
                </div>
                <div className="techstack-item">
                    <img src={SQSLogo} alt="AWS SQS" className="techstack-img" />
                    <h3 className="techstack-h3">AWS SQS</h3>
                </div>
                <div className="techstack-item">
                    <img src={TextractLogo} alt="AWS Textract" className="techstack-img" />
                    <h3 className="techstack-h3">AWS Textract</h3>
                </div>
                <div className="techstack-item">
                    <img src={MongoDBLogo} alt="MongoDB" className="techstack-img" />
                    <h3 className="techstack-h3">MongoDB</h3>
                </div>
                <div className="techstack-item">
                    <img src={RedisLogo} alt="Redis" className="techstack-img" />
                    <h3 className="techstack-h3">Redis</h3>
                </div>
                <div className="techstack-item">
                    <img src={GatewayLogo} alt="AWS API Gateway" className="techstack-img" />
                    <h3 className="techstack-h3">AWS API Gateway</h3>
                </div>
                <div className="techstack-item">
                    <img src={S3Logo} alt="AWS S3" className="techstack-img" />
                    <h3 className="techstack-h3">AWS S3</h3>
                </div>
                <div className="techstack-item">
                    <img src={SESLogo} alt="AWS SES" className="techstack-img" />
                    <h3 className="techstack-h3">AWS SES</h3>
                </div>
                <div className="techstack-item">
                    <img src={EC2Logo} alt="AWS EC2" className="techstack-img" />
                    <h3 className="techstack-h3">AWS EC2</h3>
                </div>
                <div className="techstack-item">
                    <img src={TypesenseLogo} alt="Typesense" className="techstack-img" />
                    <h3 className="techstack-h3">Typesense</h3>
                </div>
                <div className="techstack-item">
                    <img src={DockerLogo} alt="Docker" className="techstack-img" />
                    <h3 className="techstack-h3">Docker</h3>
                </div>
            </div>
        </div>
        <div className="contributors-container">
            <p className="contributors-p">Contributors</p>
            <div className="contributors-div">
                <h3 className="contributors-h3">Rithvik Ravilla</h3>
                <h3 className="contributors-h3">Gaurav Narayanan</h3>
                <h3 className="contributors-h3">Kunal Hinduja</h3>
                <h3 className="contributors-h3">Nishith Eedula</h3>
            </div>
        </div>
    </div>
  );
}
