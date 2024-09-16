import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import mongoose from 'mongoose';

const isCorrectPassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};

const getHashPassword = (password: string) => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
};

const isValidMongoId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const LogExecutionStats = async (aggregate) => {
  const exec = (await aggregate?.explain?.('executionStats')).stages[0][
    '$cursor'
  ];
  const { executionStages, ...stages } = exec.executionStats;
  console.log(
    '🚀 ~ LogExecutionStats ~ explain?.stages?.[0]:',
    exec.queryPlanner.winningPlan,
    stages,
  );
};

export default {
  isValidMongoId,
  isCorrectPassword,
  getHashPassword,
  LogExecutionStats,
};
