library(ggplot2)
library(extrafont)
library(tidyverse)
library(dplyr)

overhead_data <- read.csv(file="rq3-overhead.csv", header=TRUE, sep=",")

overhead_data <- overhead_data %>% 
  filter(Benchmark != "OBJ")

# OVERHEAD IN GENERAL

g1 <- overhead_data %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD")))  %>%
  ggplot(aes(x = Tool, y = Elapsed_time_overhead)) +
  geom_boxplot() +
  coord_cartesian(ylim = c(0, 10)) +
  scale_y_continuous(labels = function(y) paste0(y, "X")) +  
  labs(x = "", y = "Elapsed Time Overhead") +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

g1
pdf("RQ3-g1.pdf")
print(g1)
dev.off()

overhead_data %>%
  filter(Tool == "NACD") %>%
  summary()


g2 <- overhead_data %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD"))) %>%
  ggplot(aes(x = Tool, y = CPU_time_overhead)) +
  geom_boxplot() +
  coord_cartesian(ylim = c(0, 7.5)) +
  scale_y_continuous(labels = function(y) paste0(y, "X")) +  
  labs(x = "", y = "CPU Time Overhead") +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

g2
pdf("RQ3-g2.pdf")
print(g2)
dev.off()

#------------------
# analysis
overhead_data %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD"))) %>%
  ggplot(aes(x = Benchmark, y = Elapsed_time_overhead, fill = Tool)) +
  geom_bar(stat = "identity", position = position_dodge(width = 0.8)) +  # Separate bars for each Tool
  labs(
    x = "Benchmark",
    y = "Elapsed Time Overhead",
    fill = "Tool"
  ) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),                # Make all fonts bold
    axis.text.x = element_text(angle = 45, hjust = 1)  # Rotate x-axis labels for readability
  )

overhead_data %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD"))) %>%
  ggplot(aes(x = Benchmark, y = CPU_time_overhead, fill = Tool)) +
  geom_bar(stat = "identity", position = position_dodge(width = 0.8)) +  # Separate bars for each Tool
  labs(
    x = "Benchmark",
    y = "CPU Time Overhead",
    fill = "Tool"
  ) +
  coord_cartesian(ylim = c(0, 5)) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),                # Make all fonts bold
    axis.text.x = element_text(angle = 45, hjust = 1)  # Rotate x-axis labels for readability
  )

# OVERHEAD IN FUNCTION OF BUG REPRODUCTION RATIO

overhead_data <- overhead_data %>%
  mutate(
    Elapsed_time_per_bug = Elapsed_time_overhead / Bug_reproduction_ratio,
    CPU_time_per_bug = CPU_time_overhead / Bug_reproduction_ratio
  )

# per calculate only for benchmark-tool that has ratio > 0
overhead_data_no_zero <- overhead_data %>% 
  filter(Bug_reproduction_ratio != 0)

g3 <- overhead_data_no_zero %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD")))  %>%
  ggplot(aes(x = Tool, y = Elapsed_time_per_bug)) +
  geom_boxplot() +
  coord_cartesian(ylim = c(0, 0.5)) +
  scale_y_continuous(labels = function(y) paste0(y, "X")) +  
  labs(x = "", y = "Elapsed Time Overhead / Bug Reproduction Ratio") +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

g3
pdf("RQ3-g3.pdf")
print(g3)
dev.off()


g4 <- overhead_data_no_zero %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD")))  %>%
  ggplot(aes(x = Tool, y = CPU_time_per_bug)) +
  geom_boxplot() +
  coord_cartesian(ylim = c(0, 1.5)) +
  scale_y_continuous(labels = function(y) paste0(y, "X")) +  
  labs(x = "", y = "CPU Time Overhead / Bug Reproduction Ratio") +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

g4
pdf("RQ3-g4.pdf")
print(g4)
dev.off()

overhead_data_no_zero %>%
  filter(Tool == "NACD") %>%
  summary()

overhead_data_no_zero %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD"))) %>%
  ggplot(aes(x = Benchmark, y = Elapsed_time_per_bug, fill = Tool)) +
  geom_bar(stat = "identity", position = position_dodge(width = 0.8)) +  # Separate bars for each Tool
  labs(
    x = "Benchmark",
    y = "Elapsed Time Overhead / bug reproduction ratio",
    fill = "Tool"
  ) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),                # Make all fonts bold
    axis.text.x = element_text(angle = 45, hjust = 1)  # Rotate x-axis labels for readability
  )


overhead_data_no_zero %>%
  mutate(Tool = factor(Tool, levels = c("Node.fz", "NodeRacer", "NACD"))) %>%
  ggplot(aes(x = Benchmark, y = CPU_time_per_bug, fill = Tool)) +
  geom_bar(stat = "identity", position = position_dodge(width = 0.8)) +  # Separate bars for each Tool
  labs(
    x = "Benchmark",
    y = "CPU Time Overhead / bug reproduction ratio",
    fill = "Tool"
  ) +
  coord_cartesian(ylim = c(0, 0.25)) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),                # Make all fonts bold
    axis.text.x = element_text(angle = 45, hjust = 1)  # Rotate x-axis labels for readability
  )