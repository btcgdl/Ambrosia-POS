"use client"

import { useState } from "react"
import { Button, Progress, Divider } from "@heroui/react";
import { BusinessTypeStep } from "./wizard/SelectBussiness"
import { UserAccountStep } from "./wizard/AddUserAccount"
import { StoreDetailsStep } from "./wizard/AddBussinessData"
import { WizardSummary } from "./wizard/StepsSummary"

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    businessType: "store",
    userName: "",
    userPassword: "",
    storeName: "",
    storeAddress: "",
    storeRFC: "",
    storeLogo: null,
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const handleComplete = async () => {
    console.log("Datos del wizard:", data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen gradient-fresh p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="flex justify-between mb-2 relative z-10">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                  num <= step ? "bg-primary text-primary-foreground" : "bg-gray-300 text-muted-foreground"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="w-full rounded-full h-2 absolute top-[15px] z-0">
            <Progress size="md" color="primary" value={((step - 1) / 3) * 100} />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <BusinessTypeStep
              value={data.businessType}
              onChange={(businessType) => handleDataChange({ businessType })}
            />
          )}

          {step === 2 && (
            <UserAccountStep
              data={{
                userName: data.userName,
                userPassword: data.userPassword,
              }}
              onChange={(userData) => handleDataChange(userData)}
            />
          )}

          {step === 3 && (
            <StoreDetailsStep
              data={{
                storeName: data.storeName,
                storeAddress: data.storeAddress,
                storeRFC: data.storeRFC,
                storeLogo: data.storeLogo,
              }}
              onChange={(storeData) => handleDataChange(storeData)}
            />
          )}

          {step === 4 && <WizardSummary data={data} onEdit={(stepNum) => setStep(stepNum)} />}

          <Divider className="my-8 bg-gray-400" />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="bordered"
              onPress={handlePrevious}
              isDisabled={step === 1}
              className="px-6 py-2 border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </Button>

            {step < 4 ? (
              <Button
                color="primary"
                onPress={handleNext}
                isDisabled={
                  (step === 1 && !data.businessType) ||
                  (step === 2 && (!data.userName || !data.userPassword)) ||
                  (step === 3 && (!data.storeName || !data.storeAddress || !data.storeRFC))
                }
                className="gradient-forest text-white"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={handleComplete}
                className="gradient-forest text-white"
              >
                Completar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
