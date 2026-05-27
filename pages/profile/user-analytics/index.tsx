import React from 'react';
import styles from '@styles/My-Domains.module.scss'
import Layout from '../../../src/template/layout'
import ProfileLayout from '../../../src/template/profile-layout'
import { MetaData } from '../../../src/core/model/meta-data.type'
import ProfileTitle from '../../../src/template/profile-title'
import UserDomainPieChart from '@/component/user-analytic/UserDomainPieChart'
import UserDomainAnalyticsChart from '@/component/user-analytic/UserDomainAnalyticsChart'
const UserAnalyticPage: React.FC = () => {
    const meta: MetaData = {
        title: 'My Domains',
        description:
            'Discover, own, and trade web3 domains: .crypto, .nft, .eth, .polygon, .arb, .bnb, .sol, .blockchain, .tez,  .bitcoin, .dao and more on Endless Domains',
    }
    return (
        <Layout metaInfo={meta}>
            <ProfileLayout>
                <section className="row">
                    {/* <ProfileTitle title="My Domains" subtitle="List of all your domains." /> */}
                    <div className='col-md-12 mb-5'><UserDomainPieChart /></div>
                    <div className='col-md-12 mb-4'><UserDomainAnalyticsChart /></div>

                </section>

            </ProfileLayout>
        </Layout>
    );
}

export default UserAnalyticPage;