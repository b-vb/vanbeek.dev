import { calculateBMI, formatDate } from '@/lib/utils';
import { UserWithMeasurements } from '@/prisma/db';
import React from 'react';

type Props = {
  user: UserWithMeasurements;
};

export function WeightLossOgImage({ user }: Props) {
  const startWeight = user.measurements[0].weight;
  const lastWeight = user.measurements[user.measurements.length - 2].weight;
  const currentWeight = user.measurements[user.measurements.length - 1].weight;
  const goalWeight = user.goal_weight;
  const totalLost = (startWeight - currentWeight) / 1000;
  const goalDate = formatDate(user.goal_date);

  const weightDifference = lastWeight - currentWeight;
  const isWeightLoss = weightDifference > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '24px',
      gap: '24px',
    }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
        <h1 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#1f2937',
        }}
        >
          {`${user.name}'s progress`}
        </h1>
        <p style={{ fontSize: '28px', color: '#4b5563' }}>
          {`${user.height} cm | BMI ${calculateBMI(currentWeight / 1000, user.height).toFixed(1)}`}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{
          fontSize: '90px',
          color: isWeightLoss ? '#10b981' : '#f59e0b',
          marginBottom: '16px',
          marginTop: '0px',
        }}
        >
          {isWeightLoss ? '-' : '+'}
          {Math.abs(weightDifference / 1000).toFixed(1)}
          {' '}
          kg
          {isWeightLoss ? ' 🥳' : ' 😢'}
        </h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '28px', color: '#6b7280' }}>Start</span>
          <span style={{ fontSize: '48px', fontWeight: '900' }}>
            {`${(startWeight / 1000).toFixed(1)} kg`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '28px', color: '#6b7280' }}>Current</span>
          <span style={{ fontSize: '48px', fontWeight: '900' }}>
            {`${(currentWeight / 1000).toFixed(1)} kg`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '28px', color: '#6b7280' }}>Goal</span>
          <span style={{ fontSize: '48px', fontWeight: '900' }}>
            {`${(goalWeight / 1000).toFixed(1)} kg`}
          </span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '28px',
        color: '#6b7280',
      }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>
            Last:
            <span style={{ color: weightDifference > 0 ? '#10b981' : '#f59e0b', marginLeft: '5px' }}>
              {weightDifference > 0 ? '-' : '+'}
              {Math.abs(weightDifference / 1000)}
              {' '}
              kg
            </span>
          </span>
          <span>
            Total:
            <span style={{ color: totalLost > 0 ? '#10b981' : '#f59e0b', marginLeft: '5px' }}>
              {totalLost}
              kg
            </span>
          </span>
        </div>
        <span>
          (
          {((startWeight - currentWeight) / 1000).toFixed(1)}
          {' '}
          kg lost so far,
          {' '}
          {((currentWeight - goalWeight) / 1000).toFixed(1)}
          {' '}
          kg to go)
        </span>
        <span>
          {`Goal by: ${goalDate}`}
        </span>
      </div>
    </div>
  );
}
