library(ggplot2)
library(extrafont)
library(tidyverse)
library(dplyr)

data <- read.csv(file="rq1-all-results.csv", header=TRUE, sep=",")

data %>%
  filter(benchmarkid != '#24') %>%
  group_by(tool) %>%
  summarise(nRuns = n())


firstFailUnderX <- data %>% 
  filter(benchmarkid != '#24') %>%
  filter(firstfail > 0 & firstfail <= 25) 

firstFailUnderX %>%
  group_by(tool) %>%
  summarise(nRuns = n())

firstFailUnderX %>%
  filter(tool == 'NodeRacer') %>%
  summary()

#NACD      -  (661 / 690) 95.7%
#Node.fz   -  (116 / 240) 48.3%
#NodeRacer -  (603 / 690) 87.3%


#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
firstFailGeneral <- data %>% 
  filter(benchmarkid != '#24') %>%
  filter(firstfail > 0) 

firstFailGeneral %>%
  filter(tool == 'NACD') %>%
  summary()


p2 <- firstFailGeneral %>%
  mutate(tool = factor(tool, levels = c("NACD", "NodeRacer", "Node.fz"))) %>%
  ggplot(aes(firstfail, tool)) +
  geom_violin(trim = FALSE, fill = "lightblue", alpha = 0.7, position = position_dodge(width = 0.7)) +  # Violin shifted slightly
  geom_boxplot(width = 0.1, alpha = 0.8, position = position_dodge(width = 0.8), color = "black") +   # Boxplot shifted slightly
  stat_summary(fun = mean, geom = "point", shape = 4, size = 3, stroke = 1.5, color = "darkblue", position = position_dodge(width = 0.8)) +  # Red cross for mean
  labs(y = "", x = "Number of runs") +
  coord_cartesian(xlim = c(0, 100)) + 
  scale_x_continuous(breaks = seq(0, 25, by = 1)) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

p2

pdf("RQ1-p2.pdf")
print(p2)
dev.off()


firstFailGeneral %>% 
  filter(tool == 'NACD' & firstfail >25)

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# other analyses not included in the paper
summary(data)

data %>% 
  ggplot(aes( firstfail, tool, fill = benchmarkid)) + geom_boxplot() + coord_cartesian(xlim = c(0, 50))


p1 <- firstFailUnderX %>%
  mutate(tool = factor(tool, levels = c("NACD", "NodeRacer", "Node.fz"))) %>%
  ggplot(aes(firstfail, tool)) +
  geom_violin(trim = FALSE, fill = "lightblue", alpha = 0.7, position = position_dodge(width = 0.7)) +  # Violin shifted slightly
  geom_boxplot(width = 0.1, alpha = 0.8, position = position_dodge(width = 0.8), color = "black") +   # Boxplot shifted slightly
  stat_summary(fun = mean, geom = "point", shape = 4, size = 3, stroke = 1.5, color = "darkblue", position = position_dodge(width = 0.8)) +  # Red cross for mean
  labs(y = "", x = "Number of runs") +
  coord_cartesian(xlim = c(0, 25)) + 
  scale_x_continuous(breaks = seq(0, 25, by = 1)) +
  theme_bw() +
  theme(
    text = element_text(face = "bold"),              # Make all text bold
    axis.title = element_text(face = "bold"),        # Bold axis titles
    axis.text = element_text(face = "bold"),         # Bold axis text
    legend.title = element_text(face = "bold"),      # Bold legend title
    legend.text = element_text(face = "bold")        # Bold legend text
  )

p1

pdf("RQ1-p1.pdf")
print(p1)
dev.off()


ff <- data %>% 
  filter(benchmarkid != '#24') %>%
  group_by(benchmarkid, tool) %>%
  summarise(firstFailMedian = median(firstfail))

ff %>% 
  ggplot(aes(tool, firstFailMedian)) + geom_point() 
