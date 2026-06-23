import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Policy } from "../entities";
import { policyList } from 'water-bbs-shared';

export const policies:Policy<any>[] = [
  Policy.fromObject(policyList.CreateProposalCostPolicy),
  Policy.fromObject(policyList.CreateVoteCostPolicy)
];

export class PolicySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('PolicySeeder run');
    for (const policy of policies) {
      if (await em.findOne(Policy,{id: policy.id})) {
        continue;
      }
      await em.upsert(Policy, policy);
    }
  }
}